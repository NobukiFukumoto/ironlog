import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../i18n/LanguageContext';
import { getMealsByDate, saveMealLog } from '../utils/storage';
import PhotoCapture from '../components/PhotoCapture';
import FoodSearch from '../components/FoodSearch';
import NutritionSummary from '../components/NutritionSummary';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

function loadMeals(d) {
  const existing = getMealsByDate(d);
  if (existing.length > 0) {
    return existing[0].meals || [];
  }
  return MEAL_TYPES.map(type => ({ type, items: [] }));
}

export default function Meals() {
  const { t, getName } = useLanguage();
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [activeMealType, setActiveMealType] = useState('breakfast');
  const [meals, setMeals] = useState(() => loadMeals(today));
  const [saved, setSaved] = useState(false);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setMeals(loadMeals(newDate));
  };

  const activeMeal = meals.find(m => m.type === activeMealType) || { type: activeMealType, items: [] };

  const addFoodItem = (food) => {
    const servingGrams = 100;
    const newItem = {
      id: uuidv4(),
      foodId: food.key,
      foodName: getName(food),
      servingGrams,
      calories: food.per100g.calories,
      protein: food.per100g.protein,
      fat: food.per100g.fat,
      carbs: food.per100g.carbs,
      source: 'preset',
    };

    const updated = meals.map(m => {
      if (m.type === activeMealType) {
        return { ...m, items: [...m.items, newItem] };
      }
      return m;
    });

    // If meal type doesn't exist yet, add it
    if (!meals.find(m => m.type === activeMealType)) {
      updated.push({ type: activeMealType, items: [newItem] });
    }

    setMeals(updated);
    setShowFoodSearch(false);
  };

  const addAIFoods = (foods) => {
    const newItems = foods.map(f => ({
      id: uuidv4(),
      foodId: `ai-${uuidv4()}`,
      foodName: f.name,
      servingGrams: f.servingGrams || 100,
      calories: f.calories || 0,
      protein: f.protein || 0,
      fat: f.fat || 0,
      carbs: f.carbs || 0,
      source: 'ai',
    }));

    const updated = meals.map(m => {
      if (m.type === activeMealType) {
        return { ...m, items: [...m.items, ...newItems] };
      }
      return m;
    });

    setMeals(updated);
    setShowPhoto(false);
  };

  const updateFoodItem = (mealType, itemId, field, value) => {
    const updated = meals.map(m => {
      if (m.type !== mealType) return m;
      return {
        ...m,
        items: m.items.map(item => {
          if (item.id !== itemId) return item;
          const newItem = { ...item };
          if (field === 'servingGrams') {
            const ratio = (Number(value) || 0) / 100;
            // Recalculate based on original per-100g values
            const origRatio = item.servingGrams / 100;
            const baseCal = item.calories / origRatio;
            const baseProt = item.protein / origRatio;
            const baseFat = item.fat / origRatio;
            const baseCarbs = item.carbs / origRatio;
            newItem.servingGrams = Number(value) || 0;
            newItem.calories = Math.round(baseCal * ratio * 10) / 10;
            newItem.protein = Math.round(baseProt * ratio * 10) / 10;
            newItem.fat = Math.round(baseFat * ratio * 10) / 10;
            newItem.carbs = Math.round(baseCarbs * ratio * 10) / 10;
          } else {
            newItem[field] = Number(value) || 0;
          }
          return newItem;
        }),
      };
    });
    setMeals(updated);
  };

  const removeFoodItem = (mealType, itemId) => {
    const updated = meals.map(m => {
      if (m.type !== mealType) return m;
      return { ...m, items: m.items.filter(item => item.id !== itemId) };
    });
    setMeals(updated);
  };

  const dailyTotals = useMemo(() => {
    const totals = { calories: 0, protein: 0, fat: 0, carbs: 0 };
    meals.forEach(meal => {
      meal.items.forEach(item => {
        totals.calories += item.calories || 0;
        totals.protein += item.protein || 0;
        totals.fat += item.fat || 0;
        totals.carbs += item.carbs || 0;
      });
    });
    return totals;
  }, [meals]);

  const handleSave = () => {
    const existing = getMealsByDate(date);
    saveMealLog({
      id: existing.length > 0 ? existing[0].id : uuidv4(),
      date,
      meals,
      dailyTotals,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const mealTypeLabels = {
    breakfast: t('meals_breakfast'),
    lunch: t('meals_lunch'),
    dinner: t('meals_dinner'),
    snack: t('meals_snack'),
  };

  return (
    <div className="page meals-page">
      <h1 className="page-title">{t('meals_title')}</h1>

      <div className="date-navigation-container">
        <label className="section-label" style={{ marginTop: 0 }}>{t('record_date')}</label>
        <div className="date-navigation">
          <button className="nav-btn" onClick={() => {
            const d = new Date(date);
            d.setDate(d.getDate() - 1);
            handleDateChange(d.toISOString().split('T')[0]);
          }}>‹</button>
          
          <input 
            type="date" 
            value={date} 
            onChange={e => handleDateChange(e.target.value)} 
          />
          
          <button className="nav-btn" onClick={() => {
            const d = new Date(date);
            d.setDate(d.getDate() + 1);
            handleDateChange(d.toISOString().split('T')[0]);
          }}>›</button>
        </div>
      </div>

      <NutritionSummary totals={dailyTotals} />

      {/* Meal type tabs */}
      <div className="meal-type-tabs">
        {MEAL_TYPES.map(type => (
          <button
            key={type}
            className={`meal-type-tab ${activeMealType === type ? 'active' : ''}`}
            onClick={() => setActiveMealType(type)}
          >
            {mealTypeLabels[type]}
            {meals.find(m => m.type === type)?.items.length > 0 && (
              <span className="meal-count">{meals.find(m => m.type === type)?.items.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Active meal items */}
      <div className="meal-items">
        {activeMeal.items.map(item => (
          <div key={item.id} className="meal-item-card">
            <div className="meal-item-header">
              <span className="meal-item-name">
                {item.foodName}
                {item.source === 'ai' && <span className="ai-badge">AI</span>}
              </span>
              <button className="remove-btn" onClick={() => removeFoodItem(activeMealType, item.id)}>✕</button>
            </div>
            <div className="meal-item-inputs">
              <div className="meal-item-serving">
                <label>{t('meals_serving')}</label>
                <input
                  type="number"
                  value={item.servingGrams}
                  onChange={e => updateFoodItem(activeMealType, item.id, 'servingGrams', e.target.value)}
                  inputMode="numeric"
                  min="0"
                />
              </div>
              <div className="meal-item-nutrients">
                <span>{Math.round(item.calories)} kcal</span>
                <span>P: {Math.round(item.protein)}g</span>
                <span>F: {Math.round(item.fat)}g</span>
                <span>C: {Math.round(item.carbs)}g</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add food actions */}
      <div className="meal-actions">
        <button className="btn-secondary" onClick={() => { setShowFoodSearch(!showFoodSearch); setShowPhoto(false); }}>
          🔍 {t('meals_add_food')}
        </button>
        <button className="btn-secondary" onClick={() => { setShowPhoto(!showPhoto); setShowFoodSearch(false); }}>
          📸 {t('meals_photo')}
        </button>
      </div>

      {showFoodSearch && <FoodSearch onSelect={addFoodItem} />}
      {showPhoto && <PhotoCapture onFoodsDetected={addAIFoods} />}

      <button className="btn-primary btn-save" onClick={handleSave}>
        {t('meals_save')}
      </button>

      {saved && <div className="toast">{t('meals_saved')}</div>}
    </div>
  );
}
