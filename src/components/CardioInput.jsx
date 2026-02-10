import { useLanguage } from '../i18n/LanguageContext';

export default function CardioInput({ data, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="cardio-input-container">
      <div className="input-group">
        <label>{t('cardio_distance')}</label>
        <input
          type="number"
          value={data.distance}
          onChange={e => onChange({ ...data, distance: e.target.value === '' ? '' : Number(e.target.value) })}
          placeholder="0"
          inputMode="decimal"
          min="0"
          step="0.1"
        />
      </div>
      <div className="input-group">
        <label>{t('cardio_duration')}</label>
        <input
          type="number"
          value={data.duration}
          onChange={e => onChange({ ...data, duration: e.target.value === '' ? '' : Number(e.target.value) })}
          placeholder="0"
          inputMode="numeric"
          min="0"
        />
      </div>
    </div>
  );
}
