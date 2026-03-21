import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_EXERCISES, CATEGORIES } from '../data/exercises';
import { DEFAULT_FOODS, DEFAULT_NUTRITION_GOALS } from '../data/foods';
import { supabase } from '../lib/supabase';

const KEYS = {
  WORKOUTS: 'tr-workouts',
  MEALS: 'tr-meals',
  BODY_WEIGHT: 'tr-bodyweight',
  GYMS: 'tr-gyms',
  CUSTOM_EXERCISES: 'tr-custom-exercises',
  CUSTOM_FOODS: 'tr-custom-foods',
  NUTRITION_GOALS: 'tr-nutrition-goals',
  API_KEY: 'tr-gemini-api-key',
  FAVORITES: 'tr-favorites',
};

function getJSON(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Cloud Sync Helpers ---

async function pushToCloud(collection, recordId, data, isDeleted = false) {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;

  try {
    const { error } = await supabase.from('sync_records').upsert({
      user_id: session.user.id,
      collection,
      record_id: String(recordId),
      data,
      is_deleted: isDeleted,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id, collection, record_id'
    });
    if (error) console.error('Cloud sync error:', error);
  } catch (err) {
    console.error('Cloud sync exception:', err);
  }
}

let isSyncing = false;
export async function syncFromCloud() {
  if (!supabase || isSyncing) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;

  isSyncing = true;
  try {
    const { data: records, error } = await supabase
      .from('sync_records')
      .select('*')
      .order('updated_at', { ascending: true }); // Fetch all records to ensure sync on any device, ordered by time

    if (error) throw error;
    if (!records || records.length === 0) {
      isSyncing = false;
      return;
    }

    const byCol = {};
    records.forEach(r => {
      if (!byCol[r.collection]) byCol[r.collection] = [];
      byCol[r.collection].push(r);
    });

    for (const [col, items] of Object.entries(byCol)) {
      if (col === KEYS.NUTRITION_GOALS) {
        const latest = items[items.length - 1];
        if (!latest.is_deleted) setJSON(col, latest.data);
      } else if (col === KEYS.BODY_WEIGHT) {
         const current = getJSON(col, []);
         const map = new Map(current.map(c => [c.date, c]));
         items.forEach(r => {
           if (r.is_deleted) map.delete(r.record_id);
           else map.set(r.record_id, r.data);
         });
         const newArr = Array.from(map.values()).sort((a,b)=>a.date.localeCompare(b.date));
         setJSON(col, newArr);
      } else {
        const current = getJSON(col, []);
        const idField = (col === KEYS.CUSTOM_EXERCISES || col === KEYS.CUSTOM_FOODS) ? 'key' : 'id';
        const map = new Map(current.map(c => [String(c[idField]), c])); 
        items.forEach(r => {
          if (r.is_deleted) map.delete(r.record_id);
          else map.set(r.record_id, r.data);
        });
        setJSON(col, Array.from(map.values()));
      }
    }
  } catch (err) {
    console.error('Sync from cloud failed:', err);
  } finally {
    isSyncing = false;
  }
}

// --- Workouts ---
export function getWorkouts() {
  return getJSON(KEYS.WORKOUTS, []);
}

export function getWorkoutsByDate(date) {
  return getWorkouts().filter(w => w.date === date);
}

export function saveWorkout(workout) {
  const workouts = getWorkouts();
  const existing = workouts.findIndex(w => w.id === workout.id);
  const updated = { ...workout, updatedAt: new Date().toISOString() };
  if (!updated.id) updated.id = uuidv4();
  if (!updated.createdAt) updated.createdAt = updated.updatedAt;

  if (existing >= 0) {
    workouts[existing] = updated;
  } else {
    workouts.push(updated);
  }
  setJSON(KEYS.WORKOUTS, workouts);
  pushToCloud(KEYS.WORKOUTS, updated.id, updated);
  return updated;
}

export function deleteWorkout(id) {
  const workouts = getWorkouts().filter(w => w.id !== id);
  setJSON(KEYS.WORKOUTS, workouts);
  pushToCloud(KEYS.WORKOUTS, id, {}, true);
}

// --- Meals ---
export function getMeals() {
  return getJSON(KEYS.MEALS, []);
}

export function getMealsByDate(date) {
  return getMeals().filter(m => m.date === date);
}

export function saveMealLog(mealLog) {
  const meals = getMeals();
  const existing = meals.findIndex(m => m.id === mealLog.id);
  const updated = { ...mealLog, updatedAt: new Date().toISOString() };
  if (!updated.id) updated.id = uuidv4();
  if (!updated.createdAt) updated.createdAt = updated.updatedAt;

  if (existing >= 0) {
    meals[existing] = updated;
  } else {
    meals.push(updated);
  }
  setJSON(KEYS.MEALS, meals);
  pushToCloud(KEYS.MEALS, updated.id, updated);
  return updated;
}

export function deleteMealLog(id) {
  const meals = getMeals().filter(m => m.id !== id);
  setJSON(KEYS.MEALS, meals);
  pushToCloud(KEYS.MEALS, id, {}, true);
}

// --- Body Weight ---
export function getBodyWeights() {
  return getJSON(KEYS.BODY_WEIGHT, []);
}

export function saveBodyWeight(date, weight) {
  const records = getBodyWeights();
  const existing = records.findIndex(r => r.date === date);
  const updated = { date, weight };
  if (existing >= 0) {
    records[existing] = updated;
  } else {
    records.push(updated);
  }
  records.sort((a, b) => a.date.localeCompare(b.date));
  setJSON(KEYS.BODY_WEIGHT, records);
  pushToCloud(KEYS.BODY_WEIGHT, date, updated);
}

export function deleteBodyWeight(date) {
  // Not used yet but good to have
  const records = getBodyWeights().filter(r => r.date !== date);
  setJSON(KEYS.BODY_WEIGHT, records);
  pushToCloud(KEYS.BODY_WEIGHT, date, {}, true);
}

// --- Gyms ---
export function getGyms() {
  return getJSON(KEYS.GYMS, []);
}

export function saveGym(gym) {
  const gyms = getGyms();
  const existing = gyms.findIndex(g => g.id === gym.id);
  const updated = { ...gym };
  if (!updated.id) updated.id = uuidv4();

  if (existing >= 0) {
    gyms[existing] = updated;
  } else {
    gyms.push(updated);
  }
  setJSON(KEYS.GYMS, gyms);
  pushToCloud(KEYS.GYMS, updated.id, updated);
}

export function deleteGym(id) {
  setJSON(KEYS.GYMS, getGyms().filter(g => g.id !== id));
  pushToCloud(KEYS.GYMS, id, {}, true);
}

// --- Exercises ---
export function getExercises() {
  const custom = getJSON(KEYS.CUSTOM_EXERCISES, []);
  return [...DEFAULT_EXERCISES, ...custom];
}

export function getExercisesByCategory(category) {
  return getExercises().filter(e => e.category === category);
}

export function getCategories() {
  return CATEGORIES;
}

export function saveCustomExercise(exercise) {
  const custom = getJSON(KEYS.CUSTOM_EXERCISES, []);
  const updated = { ...exercise, isCustom: true };
  if (!updated.key) updated.key = uuidv4();
  custom.push(updated);
  setJSON(KEYS.CUSTOM_EXERCISES, custom);
  pushToCloud(KEYS.CUSTOM_EXERCISES, updated.key, updated);
}

export function deleteCustomExercise(key) {
  setJSON(KEYS.CUSTOM_EXERCISES, getJSON(KEYS.CUSTOM_EXERCISES, []).filter(e => e.key !== key));
  pushToCloud(KEYS.CUSTOM_EXERCISES, key, {}, true);
}

// --- Foods ---
export function getFoods() {
  const custom = getJSON(KEYS.CUSTOM_FOODS, []);
  return [...DEFAULT_FOODS, ...custom];
}

export function saveCustomFood(food) {
  const custom = getJSON(KEYS.CUSTOM_FOODS, []);
  const updated = { ...food, isCustom: true };
  if (!updated.key) updated.key = uuidv4();
  custom.push(updated);
  setJSON(KEYS.CUSTOM_FOODS, custom);
  pushToCloud(KEYS.CUSTOM_FOODS, updated.key, updated);
}

export function deleteCustomFood(key) {
  setJSON(KEYS.CUSTOM_FOODS, getJSON(KEYS.CUSTOM_FOODS, []).filter(f => f.key !== key));
  pushToCloud(KEYS.CUSTOM_FOODS, key, {}, true);
}

// --- Nutrition Goals ---
export function getNutritionGoals() {
  return getJSON(KEYS.NUTRITION_GOALS, DEFAULT_NUTRITION_GOALS);
}

export function saveNutritionGoals(goals) {
  setJSON(KEYS.NUTRITION_GOALS, goals);
  pushToCloud(KEYS.NUTRITION_GOALS, 'default', goals);
}

// --- API Key ---
export function getApiKey() {
  return localStorage.getItem(KEYS.API_KEY) || '';
}

export function saveApiKey(key) {
  localStorage.setItem(KEYS.API_KEY, key);
}

// --- Export / Import ---
export function exportAllData() {
  const data = {};
  Object.values(KEYS).forEach(key => {
    const val = localStorage.getItem(key);
    if (val) data[key] = JSON.parse(val);
  });
  data['app-language'] = localStorage.getItem('app-language') || 'en';
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString) {
  const data = JSON.parse(jsonString);
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'app-language') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      // NOTE: Intentionally not pushing to cloud automatically upon bulk import to avoid overriding cloud state accidentally.
      // A full sync system would ideally resolve conflicts, but as a simple design we keep it out of pushToCloud for now.
    }
  });
}

export function deleteAllData() {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}

// --- Favorites ---
export function getFavorites() {
  return getJSON(KEYS.FAVORITES, []);
}

export function saveFavorite(favorite) {
  const favorites = getFavorites();
  const existing = favorites.findIndex(f => f.id === favorite.id);
  const updated = { ...favorite, updatedAt: new Date().toISOString() };
  if (!updated.id) updated.id = uuidv4();
  if (!updated.createdAt) updated.createdAt = updated.updatedAt;

  if (existing >= 0) {
    favorites[existing] = updated;
  } else {
    favorites.push(updated);
  }
  setJSON(KEYS.FAVORITES, favorites);
  pushToCloud(KEYS.FAVORITES, updated.id, updated);
  return updated;
}

export function deleteFavorite(id) {
  setJSON(KEYS.FAVORITES, getFavorites().filter(f => f.id !== id));
  pushToCloud(KEYS.FAVORITES, id, {}, true);
}

// --- Utility: dates with records ---
export function getDatesWithRecords() {
  const workoutDates = new Set(getWorkouts().map(w => w.date));
  const mealDates = new Set(getMeals().map(m => m.date));
  return { workoutDates, mealDates };
}
