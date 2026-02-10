import { useLanguage } from '../i18n/LanguageContext';
import { getNutritionGoals } from '../utils/storage';

export default function NutritionSummary({ totals }) {
  const { t } = useLanguage();
  const goals = getNutritionGoals();

  const items = [
    { key: 'calories', label: t('nutrient_calories'), unit: t('nutrient_unit_kcal'), color: '#ff6b6b' },
    { key: 'protein', label: t('nutrient_protein'), unit: t('nutrient_unit_g'), color: '#51cf66' },
    { key: 'fat', label: t('nutrient_fat'), unit: t('nutrient_unit_g'), color: '#ffd43b' },
    { key: 'carbs', label: t('nutrient_carbs'), unit: t('nutrient_unit_g'), color: '#748ffc' },
  ];

  return (
    <div className="nutrition-summary">
      <h3 className="nutrition-summary-title">{t('meals_daily_total')}</h3>
      <div className="nutrition-bars">
        {items.map(item => {
          const current = totals[item.key] || 0;
          const goal = goals[item.key] || 1;
          const pct = Math.min((current / goal) * 100, 100);
          const remaining = Math.max(goal - current, 0);

          return (
            <div key={item.key} className="nutrition-bar-item">
              <div className="nutrition-bar-header">
                <span className="nutrition-bar-label">{item.label}</span>
                <span className="nutrition-bar-value">
                  &nbsp;{Math.round(current)} / {goal} {item.unit}
                </span>
              </div>
              <div className="nutrition-bar-track">
                <div
                  className="nutrition-bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="nutrition-bar-remaining">
                {t('meals_remaining')}: {Math.round(remaining)} {item.unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
