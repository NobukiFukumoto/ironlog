import { useLanguage } from '../i18n/LanguageContext';

export default function StretchInput({ duration, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="stretch-input-container">
      <div className="input-group">
        <label>{t('stretch_duration')}</label>
        <input
          type="number"
          value={duration}
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="0"
          inputMode="numeric"
          min="0"
        />
      </div>
    </div>
  );
}
