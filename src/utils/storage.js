import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_EXERCISES, CATEGORIES } from '../data/exercises';
import { DEFAULT_FOODS, DEFAULT_NUTRITION_GOALS } from '../data/foods';

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
  if (existing >= 0) {
    workouts[existing] = { ...workout, updatedAt: new Date().toISOString() };
  } else {
    workouts.push({ ...workout, id: workout.id || uuidv4(), createdAt: new Date().toISOString() });
  }
  setJSON(KEYS.WORKOUTS, workouts);
  return workout;
}

export function deleteWorkout(id) {
  const workouts = getWorkouts().filter(w => w.id !== id);
  setJSON(KEYS.WORKOUTS, workouts);
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
  if (existing >= 0) {
    meals[existing] = { ...mealLog, updatedAt: new Date().toISOString() };
  } else {
    meals.push({ ...mealLog, id: mealLog.id || uuidv4(), createdAt: new Date().toISOString() });
  }
  setJSON(KEYS.MEALS, meals);
  return mealLog;
}

export function deleteMealLog(id) {
  const meals = getMeals().filter(m => m.id !== id);
  setJSON(KEYS.MEALS, meals);
}

// --- Body Weight ---
export function getBodyWeights() {
  return getJSON(KEYS.BODY_WEIGHT, []);
}

export function saveBodyWeight(date, weight) {
  const records = getBodyWeights();
  const existing = records.findIndex(r => r.date === date);
  if (existing >= 0) {
    records[existing].weight = weight;
  } else {
    records.push({ date, weight });
  }
  records.sort((a, b) => a.date.localeCompare(b.date));
  setJSON(KEYS.BODY_WEIGHT, records);
}

// --- Gyms ---
export function getGyms() {
  return getJSON(KEYS.GYMS, []);
}

export function saveGym(gym) {
  const gyms = getGyms();
  const existing = gyms.findIndex(g => g.id === gym.id);
  if (existing >= 0) {
    gyms[existing] = gym;
  } else {
    gyms.push({ ...gym, id: gym.id || uuidv4() });
  }
  setJSON(KEYS.GYMS, gyms);
}

export function deleteGym(id) {
  setJSON(KEYS.GYMS, getGyms().filter(g => g.id !== id));
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
  custom.push({ ...exercise, key: exercise.key || uuidv4(), isCustom: true });
  setJSON(KEYS.CUSTOM_EXERCISES, custom);
}

export function deleteCustomExercise(key) {
  setJSON(KEYS.CUSTOM_EXERCISES, getJSON(KEYS.CUSTOM_EXERCISES, []).filter(e => e.key !== key));
}

// --- Foods ---
export function getFoods() {
  const custom = getJSON(KEYS.CUSTOM_FOODS, []);
  return [...DEFAULT_FOODS, ...custom];
}

export function saveCustomFood(food) {
  const custom = getJSON(KEYS.CUSTOM_FOODS, []);
  custom.push({ ...food, key: food.key || uuidv4(), isCustom: true });
  setJSON(KEYS.CUSTOM_FOODS, custom);
}

export function deleteCustomFood(key) {
  setJSON(KEYS.CUSTOM_FOODS, getJSON(KEYS.CUSTOM_FOODS, []).filter(f => f.key !== key));
}

// --- Nutrition Goals ---
export function getNutritionGoals() {
  return getJSON(KEYS.NUTRITION_GOALS, DEFAULT_NUTRITION_GOALS);
}

export function saveNutritionGoals(goals) {
  setJSON(KEYS.NUTRITION_GOALS, goals);
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
  if (existing >= 0) {
    favorites[existing] = { ...favorite, updatedAt: new Date().toISOString() };
  } else {
    favorites.push({ ...favorite, id: favorite.id || uuidv4(), createdAt: new Date().toISOString() });
  }
  setJSON(KEYS.FAVORITES, favorites);
  return favorite;
}

export function deleteFavorite(id) {
  setJSON(KEYS.FAVORITES, getFavorites().filter(f => f.id !== id));
}

// --- Utility: dates with records ---
export function getDatesWithRecords() {
  const workoutDates = new Set(getWorkouts().map(w => w.date));
  const mealDates = new Set(getMeals().map(m => m.date));
  return { workoutDates, mealDates };
}
