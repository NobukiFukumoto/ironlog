import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function GymCard({ gym, onDeleteGym, onUpdateMachine }) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [machineName, setMachineName] = useState('');

  // Sync local state with prop
  useEffect(() => {
    const currentName = gym.machines && gym.machines.length > 0 ? gym.machines[0].name : '';
    if (currentName !== machineName) {
      setMachineName(currentName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gym.machines]);

  const handleBlur = () => {
    onUpdateMachine(gym.id, machineName);
  };

  return (
    <div className="gym-card">
      <div className="gym-card-header" onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            ▼
          </span>
          <span>{gym.name}</span>
        </div>
        <button 
          className="remove-btn" 
          onClick={(e) => { e.stopPropagation(); onDeleteGym(gym.id); }}
        >
          ✕
        </button>
      </div>

      {isExpanded && (
        <div className="machines-list" style={{ padding: '12px' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t('settings_machine_name')}</label>
            <input
              type="text"
              value={machineName}
              onChange={e => setMachineName(e.target.value)}
              onBlur={handleBlur}
              placeholder={t('settings_machine_name')}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
