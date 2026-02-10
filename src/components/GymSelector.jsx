import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { getGyms } from '../utils/storage';

export default function GymSelector({ gymId, onChange }) {
  const { t } = useLanguage();
  const gyms = getGyms();
  const [showModal, setShowModal] = useState(false);

  // Helper to ensure safe access even if gymId points to deleted gym
  const selectedGym = gyms.find(g => g.id === gymId);
  const getDisplayName = (g) => {
    if (!g) return '';
    const machineName = g.machines && g.machines.length > 0 ? g.machines[0].name : '';
    return machineName ? `${g.name} (${machineName})` : g.name;
  };

  const handleGymSelect = (id) => {
    if (gymId !== id) {
      onChange(id);
    }
    setShowModal(false);
  };

  return (
    <div className="gym-selector">
      <div className="input-group">
        <label>{t('record_gym')}</label>
        
        {/* Trigger Button that looks like select but better */}
        <button 
          className="gym-select-trigger" 
          onClick={() => setShowModal(true)}
          style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: '10px', border: 'none', backgroundColor: 'var(--card-bg)', color: gymId ? 'var(--text-primary)' : 'var(--text-placeholder)', fontSize: '17px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{selectedGym ? getDisplayName(selectedGym) : t('record_select_gym')}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>▼</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{t('record_select_gym')}</span>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                {t('common_close')}
              </button>
            </div>
            
            <div className="modal-list">
              <button 
                className={`modal-item ${!gymId ? 'active' : ''}`}
                onClick={() => handleGymSelect(null)}
              >
                <span>{t('record_no_gym')}</span>
                {!gymId && <span className="modal-check">✓</span>}
              </button>
              
              {gyms.map(g => (
                <button
                  key={g.id}
                  className={`modal-item ${gymId === g.id ? 'active' : ''}`}
                  onClick={() => handleGymSelect(g.id)}
                >
                  <span>{getDisplayName(g)}</span>
                  {gymId === g.id && <span className="modal-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
