import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getFoods } from '../utils/storage';

export default function FoodSearch({ onSelect }) {
  const { t, getName } = useLanguage();
  const [query, setQuery] = useState('');
  const foods = useMemo(() => getFoods(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return foods.slice(0, 10);
    const q = query.toLowerCase();
    return foods.filter(f =>
      f.names.en.toLowerCase().includes(q) ||
      f.names.ja.includes(q) ||
      f.key.includes(q)
    );
  }, [query, foods]);

  return (
    <div className="food-search">
      <input
        type="text"
        className="food-search-input"
        placeholder={t('meals_food_search')}
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div className="food-search-results">
        {filtered.map(food => (
          <button
            key={food.key}
            className="food-search-item"
            onClick={() => { onSelect(food); setQuery(''); }}
          >
            <span className="food-name">{getName(food)}</span>
            <span className="food-info">
              {food.per100g.calories} kcal / 100g
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
