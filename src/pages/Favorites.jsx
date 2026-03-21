import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../i18n/LanguageContext';
import { getCategories, getExercisesByCategory, getGyms, getFavorites, saveFavorite, deleteFavorite } from '../utils/storage';
import { Icons } from '../components/Icons';

export default function Favorites({ onAddToWorkout }) {
  const { t, getName } = useLanguage();
  const categories = getCategories();
  const gyms = getGyms();
  
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [isCreating, setIsCreating] = useState(false);
  
  // Creation Form State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [machineId, setMachineId] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('3');

  const loadFavorites = () => {
    setFavorites(getFavorites());
  };

  const categoryExercises = selectedCategory ? getExercisesByCategory(selectedCategory) : [];
  
  // Find relevant gym machines for the selected exercise category if needed, 
  // but usually machines are tied to gyms. For favorites, we might want to specify a machine
  // if it's a machine exercise. For now, let's list all machines from all gyms or maybe just generic input?
  // Current requirement says "Gym and Machine" are preset.
  // Let's flatten all machines for selection or group by Gym.
  const allMachines = gyms.flatMap(g => (g.machines || []).map(m => ({ ...m, gymName: g.name })));

  const handleSave = () => {
    if (!selectedExercise) return;

    const exerciseDef = categoryExercises.find(e => e.key === selectedExercise);
    if (!exerciseDef) return;

    const newFav = {
      id: uuidv4(),
      exerciseId: selectedExercise,
      exerciseName: getName(exerciseDef),
      category: selectedCategory,
      machineId: machineId || null,
      sets: parseInt(sets) || 1,
      weight: parseFloat(weight) || 0,
      reps: parseFloat(reps) || 0,
      type: exerciseDef.type
    };

    saveFavorite(newFav);
    loadFavorites();
    setIsCreating(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm(t('confirm_delete') || 'Delete this favorite?')) {
      deleteFavorite(id);
      loadFavorites();
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setSelectedExercise('');
    setMachineId('');
    setWeight('');
    setReps('');
    setSets('3');
  };

  const handleAddToWorkout = (fav) => {
    // Construct sets array based on fav.sets count
    const setsToAdd = [];
    for (let i = 0; i < fav.sets; i++) {
        setsToAdd.push({ weight: fav.weight, reps: fav.reps });
    }

    const exerciseToAdd = {
        id: uuidv4(),
        exerciseId: fav.exerciseId,
        exerciseName: fav.exerciseName,
        category: fav.category,
        type: fav.type,
        machineId: fav.machineId,
        sets: setsToAdd,
        // Default values for other types if needed, though favorites seem focused on weight training
        ...(fav.type === 'cardio' ? { distance: '', duration: '' } : {}),
        ...(fav.type === 'stretching' ? { duration: '' } : {}),
    };

    onAddToWorkout(exerciseToAdd);
  };

  return (
    <div className="page favorites-page" style={{ paddingBottom: '80px' }}>
      <header className="page-header">
        <h1 className="page-title">Favorites</h1>
        <button 
            className="btn-primary small" 
            onClick={() => setIsCreating(!isCreating)}
            style={{ marginLeft: 'auto' }}
        >
            {isCreating ? 'Cancel' : '+ New'}
        </button>
      </header>

      {isCreating && (
        <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
            <h3>Create Favorite Set</h3>
            
            {/* Category Selection */}
            <div className="input-group">
                <label>Category</label>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.key} value={c.key}>{getName(c)}</option>
                    ))}
                </select>
            </div>

            {/* Exercise Selection */}
            {selectedCategory && (
                <div className="input-group">
                    <label>Exercise</label>
                    <select value={selectedExercise} onChange={e => setSelectedExercise(e.target.value)}>
                        <option value="">Select Exercise</option>
                        {categoryExercises.map(e => (
                            <option key={e.key} value={e.key}>{getName(e)}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Machine Selection (Optional) */}
            <div className="input-group">
                <label>Machine (Optional)</label>
                <select value={machineId} onChange={e => setMachineId(e.target.value)}>
                    <option value="">None</option>
                    {allMachines.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.gymName})</option>
                    ))}
                </select>
            </div>

            {/* Set Details */}
            <div className="row" style={{ gap: '10px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Sets</label>
                    <input type="number" value={sets} onChange={e => setSets(e.target.value)} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Weight (kg)</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label>Reps</label>
                    <input type="number" value={reps} onChange={e => setReps(e.target.value)} />
                </div>
            </div>

            <button 
                className="btn-primary" 
                onClick={handleSave}
                disabled={!selectedExercise}
                style={{ marginTop: '16px', width: '100%' }}
            >
                Save Favorite
            </button>
        </div>
      )}

      <div className="favorites-list">
        {favorites.length === 0 && !isCreating && (
            <div className="empty-state">
                <p>No favorite sets yet.</p>
                <p>Add some to quickly build your workouts!</p>
            </div>
        )}

        {favorites.map(fav => (
            <div key={fav.id} className="card favorite-card" style={{ marginBottom: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>{fav.exerciseName}</h3>
                    <button className="icon-btn" onClick={() => handleDelete(fav.id)} style={{ color: '#ff4444' }}>
                        <Icons.Utensils style={{ transform: 'rotate(45deg)' }} width={16} height={16} /> {/* Using Utensils as temp cross if X not avail, but we have X in remove-btn usually. Let's strictly use text or available icons */}
                        ✕
                    </button>
                </div>
                
                <div style={{ fontSize: '0.9em', color: '#888' }}>
                    {fav.sets} sets x {fav.weight}kg x {fav.reps} reps
                    {fav.machineId && allMachines.find(m => m.id === fav.machineId) && (
                        <span> • {allMachines.find(m => m.id === fav.machineId).name}</span>
                    )}
                </div>

                <button 
                    className="btn-primary" 
                    onClick={() => handleAddToWorkout(fav)}
                    style={{ marginTop: '8px' }}
                >
                    + Add to Workout
                </button>
            </div>
        ))}
      </div>
    </div>
  );
}
