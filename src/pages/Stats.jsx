import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getWorkouts, getMeals, getBodyWeights, getExercises, getCategories } from '../utils/storage';
import { saveBodyWeight } from '../utils/storage';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const PERIODS = { week: 7, month: 30, '3months': 90 };

export default function Stats() {
  const { t, getName } = useLanguage();
  const [period, setPeriod] = useState('month');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [bodyWeightInput, setBodyWeightInput] = useState('');
  const [bwSaved, setBwSaved] = useState(false);

  const today = new Date();
  const days = PERIODS[period];
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split('T')[0];

  const workouts = useMemo(() => getWorkouts().filter(w => w.date >= startStr), [startStr]);
  const meals = useMemo(() => getMeals().filter(m => m.date >= startStr), [startStr]);
  const bodyWeights = useMemo(() => getBodyWeights(), [bwSaved]);
  const exercises = useMemo(() => getExercises(), []);
  const categories = getCategories();

  // Training days
  const trainingDays = new Set(workouts.map(w => w.date)).size;

  // Body part frequency
  const bodyPartData = useMemo(() => {
    const freq = {};
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        freq[ex.category] = (freq[ex.category] || 0) + 1;
      });
    });
    const labels = categories.map(c => getName(c));
    const data = categories.map(c => freq[c.key] || 0);
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#ff6b6b', '#51cf66', '#748ffc', '#ffd43b', '#cc5de8', '#ff922b', '#20c997', '#868e96'],
        borderRadius: 6,
      }],
    };
  }, [workouts, categories, getName]);

  // Weight progress for selected exercise
  const weightProgressData = useMemo(() => {
    if (!selectedExercise) return null;
    const points = [];
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.exerciseId === selectedExercise && ex.type === 'weight' && ex.sets) {
          const maxWeight = Math.max(...ex.sets.map(s => s.weight || 0));
          const best1RM = Math.max(...ex.sets.filter(s => s.weight && s.reps).map(s => s.weight * (1 + s.reps / 30)));
          if (maxWeight > 0) points.push({ date: w.date, maxWeight, est1RM: Math.round(best1RM * 10) / 10 });
        }
      });
    });
    points.sort((a, b) => a.date.localeCompare(b.date));
    return {
      labels: points.map(p => p.date.slice(5)),
      datasets: [
        { label: t('stats_weight_progress'), data: points.map(p => p.maxWeight), borderColor: '#748ffc', backgroundColor: 'rgba(116,143,252,0.1)', fill: true, tension: 0.3 },
        { label: t('stats_estimated_1rm'), data: points.map(p => p.est1RM), borderColor: '#ff6b6b', backgroundColor: 'rgba(255,107,107,0.1)', fill: true, tension: 0.3 },
      ],
    };
  }, [selectedExercise, workouts, t]);

  // Body weight trend
  const bwData = useMemo(() => {
    const recent = bodyWeights.filter(b => b.date >= startStr);
    return {
      labels: recent.map(b => b.date.slice(5)),
      datasets: [{
        label: t('stats_body_weight'),
        data: recent.map(b => b.weight),
        borderColor: '#51cf66',
        backgroundColor: 'rgba(81,207,102,0.1)',
        fill: true,
        tension: 0.3,
      }],
    };
  }, [bodyWeights, startStr, t]);

  // Calorie trend
  const calorieData = useMemo(() => {
    const byDate = {};
    meals.forEach(m => {
      byDate[m.date] = (byDate[m.date] || 0) + (m.dailyTotals?.calories || 0);
    });
    const sorted = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b));
    return {
      labels: sorted.map(([d]) => d.slice(5)),
      datasets: [{
        label: t('stats_calorie_trend'),
        data: sorted.map(([, v]) => Math.round(v)),
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255,107,107,0.1)',
        fill: true,
        tension: 0.3,
      }],
    };
  }, [meals, t]);

  // Macro breakdown (total for period)
  const macroData = useMemo(() => {
    const totals = { protein: 0, fat: 0, carbs: 0 };
    meals.forEach(m => {
      totals.protein += m.dailyTotals?.protein || 0;
      totals.fat += m.dailyTotals?.fat || 0;
      totals.carbs += m.dailyTotals?.carbs || 0;
    });
    return {
      labels: [t('nutrient_protein'), t('nutrient_fat'), t('nutrient_carbs')],
      datasets: [{
        data: [Math.round(totals.protein), Math.round(totals.fat), Math.round(totals.carbs)],
        backgroundColor: ['#51cf66', '#ffd43b', '#748ffc'],
      }],
    };
  }, [meals, t]);

  const handleSaveBodyWeight = () => {
    const weight = parseFloat(bodyWeightInput);
    if (!weight || weight <= 0) return;
    saveBodyWeight(today.toISOString().split('T')[0], weight);
    setBodyWeightInput('');
    setBwSaved(v => !v);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#e0e0e0' } } },
    scales: {
      x: { ticks: { color: '#aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#aaa' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#e0e0e0' }, position: 'bottom' } },
  };

  const uniqueExercises = useMemo(() => {
    const seen = new Set();
    const result = [];
    workouts.forEach(w => {
      w.exercises.forEach(ex => {
        if (ex.type === 'weight' && !seen.has(ex.exerciseId)) {
          seen.add(ex.exerciseId);
          result.push({ key: ex.exerciseId, name: ex.exerciseName });
        }
      });
    });
    return result;
  }, [workouts]);

  return (
    <div className="page stats-page">
      <h1 className="page-title">{t('stats_title')}</h1>

      {/* Period selector */}
      <div className="period-tabs">
        {Object.keys(PERIODS).map(p => (
          <button key={p} className={`period-tab ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
            {t(`stats_period_${p}`)}
          </button>
        ))}
      </div>

      {/* Training days */}
      <div className="stat-card">
        <h3>{t('stats_training_days')}</h3>
        <div className="stat-big-number">{trainingDays}</div>
      </div>

      {/* Body weight input */}
      <div className="stat-card">
        <h3>{t('stats_body_weight')}</h3>
        <div className="bw-input-row">
          <input
            type="number"
            value={bodyWeightInput}
            onChange={e => setBodyWeightInput(e.target.value)}
            placeholder={t('bodyweight_input')}
            inputMode="decimal"
            step="0.1"
          />
          <button className="btn-primary btn-sm" onClick={handleSaveBodyWeight}>{t('bodyweight_save')}</button>
        </div>
        {bwData.labels.length > 0 && (
          <div className="chart-container"><Line data={bwData} options={chartOptions} /></div>
        )}
      </div>

      {/* Body part frequency */}
      <div className="stat-card">
        <h3>{t('stats_body_parts')}</h3>
        <div className="chart-container"><Bar data={bodyPartData} options={chartOptions} /></div>
      </div>

      {/* Weight progress */}
      <div className="stat-card">
        <h3>{t('stats_weight_progress')}</h3>
        <select
          value={selectedExercise}
          onChange={e => setSelectedExercise(e.target.value)}
          className="exercise-select"
        >
          <option value="">{t('stats_select_exercise')}</option>
          {uniqueExercises.map(ex => (
            <option key={ex.key} value={ex.key}>{ex.name}</option>
          ))}
        </select>
        {weightProgressData && weightProgressData.labels.length > 0 && (
          <div className="chart-container"><Line data={weightProgressData} options={chartOptions} /></div>
        )}
      </div>

      {/* Calorie trend */}
      <div className="stat-card">
        <h3>{t('stats_calorie_trend')}</h3>
        {calorieData.labels.length > 0 ? (
          <div className="chart-container"><Line data={calorieData} options={chartOptions} /></div>
        ) : <p className="no-data">{t('stats_no_data')}</p>}
      </div>

      {/* Macro breakdown */}
      <div className="stat-card">
        <h3>{t('stats_macro_breakdown')}</h3>
        {macroData.datasets[0].data.some(v => v > 0) ? (
          <div className="chart-container chart-doughnut"><Doughnut data={macroData} options={doughnutOptions} /></div>
        ) : <p className="no-data">{t('stats_no_data')}</p>}
      </div>
    </div>
  );
}
