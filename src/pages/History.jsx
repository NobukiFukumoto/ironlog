import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getWorkoutsByDate, getMealsByDate, getDatesWithRecords, deleteWorkout, deleteMealLog } from '../utils/storage';
import Calendar from '../components/Calendar';

export default function History() {
  const { t } = useLanguage();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [refreshKey, setRefreshKey] = useState(0);

  const { workoutDates, mealDates } = useMemo(() => getDatesWithRecords(), [refreshKey]);
  const dayWorkouts = useMemo(() => getWorkoutsByDate(selectedDate), [selectedDate, refreshKey]);
  const dayMeals = useMemo(() => getMealsByDate(selectedDate), [selectedDate, refreshKey]);

  const handleDeleteWorkout = (id) => {
    if (confirm(t('history_delete_confirm'))) {
      deleteWorkout(id);
      setRefreshKey(k => k + 1);
    }
  };

  const handleDeleteMeal = (id) => {
    if (confirm(t('history_delete_confirm'))) {
      deleteMealLog(id);
      setRefreshKey(k => k + 1);
    }
  };

  return (
    <div className="page history-page">
      <h1 className="page-title">{t('history_title')}</h1>

      <Calendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        workoutDates={workoutDates}
        mealDates={mealDates}
      />

      <div className="history-detail">
        {/* Workouts */}
        {dayWorkouts.length > 0 && (
          <div className="history-section">
            <h3 className="history-section-title">🏋️ {t('history_workout')}</h3>
            {dayWorkouts.map(workout => (
              <div key={workout.id} className="history-card">
                <div className="history-card-header">
                  <span className="history-card-time">
                    {workout.createdAt ? new Date(workout.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                  <button className="remove-btn" onClick={() => handleDeleteWorkout(workout.id)}>
                    {t('history_delete')}
                  </button>
                </div>
                {workout.exercises.map((ex, i) => (
                  <div key={i} className="history-exercise">
                    <span className="history-exercise-name">{ex.exerciseName}</span>
                    {ex.type === 'weight' && ex.sets && (
                      <div className="history-sets">
                        {ex.sets.map((set, j) => (
                          <span key={j} className="history-set">
                            {set.weight}kg × {set.reps}
                          </span>
                        ))}
                      </div>
                    )}
                    {ex.type === 'cardio' && (
                      <span className="history-cardio">
                        {ex.distance && `${ex.distance}km`} {ex.duration && `${ex.duration}min`}
                      </span>
                    )}
                    {ex.type === 'stretching' && (
                      <span className="history-stretch">{ex.duration}sec</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Meals */}
        {dayMeals.length > 0 && (
          <div className="history-section">
            <h3 className="history-section-title">🍽️ {t('history_meals')}</h3>
            {dayMeals.map(mealLog => (
              <div key={mealLog.id} className="history-card">
                <div className="history-card-header">
                  <span className="history-card-totals">
                    {Math.round(mealLog.dailyTotals?.calories || 0)} kcal
                  </span>
                  <button className="remove-btn" onClick={() => handleDeleteMeal(mealLog.id)}>
                    {t('history_delete')}
                  </button>
                </div>
                {mealLog.meals?.filter(m => m.items.length > 0).map((meal, i) => (
                  <div key={i} className="history-meal">
                    <span className="history-meal-type">{t(`meals_${meal.type}`)}</span>
                    <div className="history-meal-items">
                      {meal.items.map((item, j) => (
                        <span key={j} className="history-meal-item">
                          {item.foodName} ({item.servingGrams}g) — {Math.round(item.calories)}kcal
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {dayWorkouts.length === 0 && dayMeals.length === 0 && (
          <p className="no-data">{t('history_no_records')}</p>
        )}
      </div>
    </div>
  );
}
