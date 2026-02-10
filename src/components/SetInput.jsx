import { useLanguage } from '../i18n/LanguageContext';

export default function SetInput({ sets, onChange }) {
  const { t } = useLanguage();

  const updateSet = (index, field, value) => {
    const updated = [...sets];
    updated[index] = { ...updated[index], [field]: value === '' ? '' : Number(value) };
    onChange(updated);
  };

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    onChange([...sets, { weight: lastSet?.weight || '', reps: lastSet?.reps || '' }]);
  };

  const removeSet = (index) => {
    if (sets.length <= 1) return;
    onChange(sets.filter((_, i) => i !== index));
  };

  return (
    <div className="set-input-container">
      <div className="set-header-row">
        <span className="set-header-num">#</span>
        <span className="set-header-weight">{t('set_weight')}</span>
        <span className="set-header-reps">{t('set_reps')}</span>
        <span className="set-header-action"></span>
      </div>
      {sets.map((set, i) => (
        <div key={i} className="set-row">
          <span className="set-number">{i + 1}</span>
          <input
            type="number"
            className="set-input"
            value={set.weight}
            onChange={e => updateSet(i, 'weight', e.target.value)}
            placeholder="0"
            inputMode="decimal"
            min="0"
            step="0.5"
          />
          <input
            type="number"
            className="set-input"
            value={set.reps}
            onChange={e => updateSet(i, 'reps', e.target.value)}
            placeholder="0"
            inputMode="numeric"
            min="0"
          />
          <button className="set-remove-btn" onClick={() => removeSet(i)} disabled={sets.length <= 1}>✕</button>
        </div>
      ))}
      <button className="set-add-btn" onClick={addSet}>+ {t('set_add')}</button>
    </div>
  );
}
