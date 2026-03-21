import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import RestTimer from './RestTimer';
import ConfirmModal from './ConfirmModal';

export default function SetInput({ sets, onChange }) {
  const { t } = useLanguage();
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const updateSet = (index, field, value) => {
    const updated = [...sets];
    if (field === 'completed') {
      updated[index] = { ...updated[index], completed: value };
      // Show timer modal when checked to true
      if (value === true) {
        setShowTimerModal(true);
      }
    } else {
      updated[index] = { ...updated[index], [field]: value === '' ? '' : Number(value) };
    }
    onChange(updated);
  };

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    onChange([...sets, { weight: lastSet?.weight || '', reps: lastSet?.reps || '', completed: false }]);
  };

  const attemptRemoveSet = (index) => {
    if (sets.length <= 1) return;
    const set = sets[index];
    if (set.weight || set.reps) {
      setDeleteIndex(index);
    } else {
      confirmRemoveSet(index);
    }
  };

  const confirmRemoveSet = (index) => {
    onChange(sets.filter((_, i) => i !== index));
    setDeleteIndex(null);
  };

  return (
    <div className="set-input-container">
      <div className="set-header-row">
        <span className="set-header-num">#</span>
        <span className="set-header-weight">{t('set_weight')}</span>
        <span className="set-header-reps">{t('set_reps')}</span>
        <span className="set-header-action"></span>
        <span className="set-header-action"></span>
      </div>
      {sets.map((set, i) => (
        <div key={i} className="set-row">
          <span className="set-number">{i + 1}</span>
          <input
            type="number"
            className="set-input"
            value={set.weight !== undefined ? set.weight : ''}
            onChange={e => updateSet(i, 'weight', e.target.value)}
            placeholder="0"
            inputMode="decimal"
            min="0"
            step="0.5"
          />
          <input
            type="number"
            className="set-input"
            value={set.reps !== undefined ? set.reps : ''}
            onChange={e => updateSet(i, 'reps', e.target.value)}
            placeholder="0"
            inputMode="numeric"
            min="0"
          />
          <button 
            className={`set-check-btn ${set.completed ? 'completed' : ''}`}
            onClick={() => updateSet(i, 'completed', !set.completed)}
          >
            ✓
          </button>
          <button className="set-remove-btn" onClick={() => attemptRemoveSet(i)} disabled={sets.length <= 1}>✕</button>
        </div>
      ))}
      <button className="set-add-btn" onClick={addSet}>+ {t('set_add')}</button>

      {showTimerModal && (
        <div className="modal-overlay" onClick={() => setShowTimerModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('timer_title')}</h3>
              <button className="modal-close-btn" onClick={() => setShowTimerModal(false)}>✕</button>
            </div>
            {/* The timer is unmounted when closed, so each time it opens it starts fresh */}
            <RestTimer autoExpand={true} autoStart={true} defaultSeconds={90} />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteIndex !== null}
        message={t('common_delete') + "?\n(Delete this set?)"}
        onConfirm={() => confirmRemoveSet(deleteIndex)}
        onCancel={() => setDeleteIndex(null)}
        confirmText={t('common_delete')}
        cancelText={t('common_cancel')}
        isDanger={true}
      />
    </div>
  );
}
