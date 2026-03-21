import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../i18n/LanguageContext';
import { getCategories, getExercisesByCategory, saveWorkout, getGyms } from '../utils/storage';
import SetInput from '../components/SetInput';
import CardioInput from '../components/CardioInput';
import StretchInput from '../components/StretchInput';
import GymSelector from '../components/GymSelector';
import ConfirmModal from '../components/ConfirmModal';

export default function Record({ date, setDate, gymId, setGymId, exercises, setExercises }) {
  const { t, getName } = useLanguage();
  const categories = getCategories();
  const gyms = getGyms();
  
  const [saved, setSaved] = useState(false);
  const [deleteExerciseIndex, setDeleteExerciseIndex] = useState(null);

  // Exercise being added
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const categoryExercises = selectedCategory ? getExercisesByCategory(selectedCategory) : [];
  /* eslint-disable-next-line no-unused-vars */
  const selectedCategoryObj = categories.find(c => c.key === selectedCategory);

  const selectedGym = gyms.find(g => g.id === gymId);
  const gymMachines = selectedGym?.machines || [];

  const addExercise = () => {
    if (!selectedExercise) return;
    const ex = categoryExercises.find(e => e.key === selectedExercise);
    if (!ex) return;

    // Auto-select machine if only one exists in the current gym
    let defaultMachineId = null;
    if (gymMachines.length === 1) {
      defaultMachineId = gymMachines[0].id;
    }

    const newEx = {
      id: uuidv4(),
      exerciseId: ex.key,
      exerciseName: getName(ex),
      category: ex.category,
      type: ex.type,
      machineId: defaultMachineId, // Auto-select if single machine
      ...(ex.type === 'weight' ? { sets: [{ weight: '', reps: '' }] } : {}),
      ...(ex.type === 'cardio' ? { distance: '', duration: '' } : {}),
      ...(ex.type === 'stretching' ? { duration: '' } : {}),
    };

    setExercises([...exercises, newEx]);
    setSelectedExercise(null);
  };

  const updateExercise = (index, data) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], ...data };
    setExercises(updated);
  };

  const confirmRemoveExercise = () => {
    if (deleteExerciseIndex === null) return;
    setExercises(exercises.filter((_, i) => i !== deleteExerciseIndex));
    setDeleteExerciseIndex(null);
  };

  const handleSave = () => {
    if (exercises.length === 0) return;
    saveWorkout({
      id: uuidv4(),
      date,
      gymId,
      // machineId removed from top level
      exercises: exercises.map(ex => {
        const base = { 
          type: ex.type, 
          exerciseId: ex.exerciseId, 
          exerciseName: ex.exerciseName, 
          category: ex.category,
          machineId: ex.machineId 
        };
        if (ex.type === 'weight') return { ...base, sets: ex.sets.filter(s => s.weight !== '' || s.reps !== '') };
        if (ex.type === 'cardio') return { ...base, distance: ex.distance, duration: ex.duration };
        return { ...base, duration: ex.duration };
      }),
    });
    setExercises([]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page record-page">
      <h1 className="page-title">{t('record_title')}</h1>

      <div className="record-form">
        <div className="input-group">
          <label>{t('record_date')}</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <GymSelector
          gymId={gymId}
          onChange={(gid) => {
            setGymId(gid);
            // Auto-select machine if the selected gym has only one machine
            // Logic handled in addExercise now
          }}
        />

        {/* Exercise list */}
        <div className="exercise-list">
          {exercises.map((ex, i) => (
            <div key={ex.id} className="exercise-card">
              <div className="exercise-card-header">
                <h3>{ex.exerciseName}</h3>
                <button className="remove-btn" onClick={() => setDeleteExerciseIndex(i)}>✕</button>
              </div>

              {/* Machine Selector per Exercise */}
              {gymId && gymMachines.length > 0 && (
                <div className="input-group" style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px' }}>{t('record_machine')}</label>
                  <select
                    value={ex.machineId || ''}
                    onChange={e => updateExercise(i, { machineId: e.target.value || null })}
                    style={{ width: '100%', padding: '8px', fontSize: '15px' }}
                  >
                    <option value="">{t('record_select_machine')}</option>
                    {gymMachines.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {ex.type === 'weight' && (
                <SetInput sets={ex.sets} onChange={sets => updateExercise(i, { sets })} />
              )}
              {ex.type === 'cardio' && (
                <CardioInput
                  data={{ distance: ex.distance, duration: ex.duration }}
                  onChange={data => updateExercise(i, data)}
                />
              )}
              {ex.type === 'stretching' && (
                <StretchInput
                  duration={ex.duration}
                  onChange={duration => updateExercise(i, { duration })}
                />
              )}
            </div>
          ))}
        </div>

        {/* Add exercise */}
        <div className="add-exercise-section">
          <h3>{t('record_add_exercise')}</h3>
          <h4 className="section-label">{t('record_category')}</h4>
          <div className="category-grid">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`category-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => {
                  if (selectedCategory === cat.key) {
                    setSelectedCategory('');
                  } else {
                    setSelectedCategory(cat.key);
                  }
                  setSelectedExercise(null);
                }}
              >
                {getName(cat)}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <div className="exercise-selection-area">
              <hr className="section-divider" />
              <h4 className="section-label">{t('record_exercise')}</h4>
              <div className="exercise-select-list">
                {categoryExercises.map(ex => (
                  <button
                    key={ex.key}
                    className={`exercise-select-btn ${selectedExercise === ex.key ? 'active' : ''}`}
                    onClick={() => setSelectedExercise(ex.key)}
                  >
                    {getName(ex)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedExercise && (
            <button className="btn-primary" onClick={addExercise}>
              + {t('record_add_exercise')}
            </button>
          )}
        </div>

        {exercises.length > 0 && (
          <button className="btn-primary btn-save" onClick={handleSave}>
            {t('record_save')}
          </button>
        )}

        {saved && <div className="toast">{t('record_saved')}</div>}
      </div>

      <ConfirmModal
        isOpen={deleteExerciseIndex !== null}
        message={t('common_delete') + "?\n(Delete this exercise?)"}
        onConfirm={confirmRemoveExercise}
        onCancel={() => setDeleteExerciseIndex(null)}
        confirmText={t('common_delete')}
        cancelText={t('common_cancel')}
        isDanger={true}
      />
    </div>
  );
}
