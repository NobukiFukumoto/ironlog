import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getGyms, saveGym, deleteGym,
  getNutritionGoals, saveNutritionGoals,
  getApiKey, saveApiKey,
  exportAllData, importAllData, deleteAllData,
  syncFromCloud
} from '../utils/storage';
import GymCard from '../components/GymCard';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

const SettingsIcon = ({ bgColor, children }) => (
  <div className="settings-icon" style={{ backgroundColor: bgColor }}>
    {children}
  </div>
);

const CloudIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>;
const GlobeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>;
const KeyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const TargetIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const BuildingIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M9 9h6M9 13h6M9 17h6"/></svg>;
const ExportIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;
const ImportIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

export default function Settings() {
  const { t, lang, switchLanguage } = useLanguage();
  const [gyms, setGyms] = useState(() => getGyms());
  const [goals, setGoals] = useState(() => getNutritionGoals());
  const [apiKey, setApiKey] = useState(() => getApiKey());
  const [newGymName, setNewGymName] = useState('');
  const [toast, setToast] = useState('');
  const [confirmState, setConfirmState] = useState({ isOpen: false, type: null });
  const [activeModal, setActiveModal] = useState(null);

  // Auth states
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async () => {
    if (!supabase || !email || !password) return;
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setAuthLoading(false);
    if (error) {
      alert(t('auth_error') + ': ' + error.message);
    } else {
      showToast(t('auth_signup_success'));
      setActiveModal(null);
    }
  };

  const handleLogin = async () => {
    if (!supabase || !email || !password) return;
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) {
      alert(t('auth_error') + ': ' + error.message);
    } else {
      showToast(t('auth_success'));
      syncFromCloud().then(() => {
        // UI強制更新のため一部ステートをリロード
        setGyms(getGyms());
        setGoals(getNutritionGoals());
      });
      setActiveModal(null);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setActiveModal(null);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  // Gym management
  const handleAddGym = () => {
    if (!newGymName.trim()) return;
    const gym = { id: uuidv4(), name: newGymName.trim(), machines: [] };
    saveGym(gym);
    setGyms(getGyms());
    setNewGymName('');
  };

  const handleDeleteGym = (id) => {
    deleteGym(id);
    setGyms(getGyms());
  };

  const handleUpdateMachine = (gymId, machineName) => {
    const gym = gyms.find(g => g.id === gymId);
    if (!gym) return;

    if (!machineName.trim()) {
      // If empty, remove the machine (if exists)
      gym.machines = [];
    } else {
      // Update existing or add new
      if (gym.machines.length > 0) {
        gym.machines[0].name = machineName;
      } else {
        gym.machines.push({ id: uuidv4(), name: machineName });
      }
    }
    saveGym(gym);
    setGyms(getGyms());
  };

  // ... (keeping other handlers if needed, but GymCard mostly uses update now)

  // ...

        {gyms.map(gym => (
          <GymCard
            key={gym.id}
            gym={gym}
            onDeleteGym={handleDeleteGym}
            onUpdateMachine={handleUpdateMachine}
          />
        ))}

  // Nutrition goals
  const handleGoalChange = (key, value) => {
    const updated = { ...goals, [key]: Number(value) || 0 };
    setGoals(updated);
    saveNutritionGoals(updated);
  };

  // API key
  const handleApiKeySave = () => {
    saveApiKey(apiKey);
    showToast('API Key saved');
  };

  // Export
  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('settings_exported'));
  };

  // Import
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          importAllData(reader.result);
          setGyms(getGyms());
          setGoals(getNutritionGoals());
          setApiKey(getApiKey());
          showToast(t('settings_imported'));
        } catch (err) {
          alert('Import failed: ' + err.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Delete all
  const executeDeleteAll = () => {
    deleteAllData();
    setGyms([]);
    setGoals(getNutritionGoals());
    setApiKey('');
    showToast(t('settings_deleted'));
  };

  // Confirm Modal Handlers
  const confirmAction = () => {
    const type = confirmState.type;
    setConfirmState({ isOpen: false, type: null });
    if (type === 'export') {
      handleExport();
    } else if (type === 'import') {
      handleImport();
    } else if (type === 'delete') {
      executeDeleteAll();
    }
  };

  const cancelAction = () => setConfirmState({ isOpen: false, type: null });

  return (
    <div className="page settings-page">
      <h1 className="page-title">{t('settings_title')}</h1>

      <div className="settings-list">
        <button className="settings-item" onClick={() => setActiveModal('auth')}>
          <div className="settings-item-label">
            <SettingsIcon bgColor="#007AFF"><CloudIcon /></SettingsIcon>
            <span>{t('auth_title')}</span>
          </div>
          <span className="settings-item-value">{user ? t('auth_logged_in_as') + user.email : t('auth_not_logged_in')} &gt;</span>
        </button>
      </div>

      <div className="settings-list">
        <button className="settings-item" onClick={() => setActiveModal('language')}>
          <div className="settings-item-label">
            <SettingsIcon bgColor="#0A84FF"><GlobeIcon /></SettingsIcon>
            <span>{t('settings_language')}</span>
          </div>
          <span className="settings-item-value">{lang === 'en' ? 'English' : '日本語'} &gt;</span>
        </button>
        <button className="settings-item" onClick={() => setActiveModal('apiKey')}>
          <div className="settings-item-label">
            <SettingsIcon bgColor="#5E5CE6"><KeyIcon /></SettingsIcon>
            <span>{t('settings_api_key')}</span>
          </div>
          <span className="settings-item-value">{apiKey ? '********' : 'Not set'} &gt;</span>
        </button>
        <button className="settings-item" onClick={() => setActiveModal('nutrition')}>
          <div className="settings-item-label">
            <SettingsIcon bgColor="#30D158"><TargetIcon /></SettingsIcon>
            <span>{t('settings_nutrition_goals')}</span>
          </div>
          <span className="settings-item-value">&gt;</span>
        </button>
        <button className="settings-item" onClick={() => setActiveModal('gyms')}>
          <div className="settings-item-label">
            <SettingsIcon bgColor="#FF9F0A"><BuildingIcon /></SettingsIcon>
            <span>{t('settings_gyms')}</span>
          </div>
          <span className="settings-item-value">{gyms.length} {t('settings_gyms')} &gt;</span>
        </button>
      </div>

      <div className="settings-list">
        <button className="settings-item" onClick={() => setConfirmState({ isOpen: true, type: 'export' })}>
          <div className="settings-item-label">
            <SettingsIcon bgColor="#8E8E93"><ExportIcon /></SettingsIcon>
            <span>{t('settings_export')}</span>
          </div>
        </button>
        <button className="settings-item" onClick={() => setConfirmState({ isOpen: true, type: 'import' })}>
          <div className="settings-item-label">
            <SettingsIcon bgColor="#8E8E93"><ImportIcon /></SettingsIcon>
            <span>{t('settings_import')}</span>
          </div>
        </button>
        <button className="settings-item" onClick={() => setConfirmState({ isOpen: true, type: 'delete' })}>
          <div className="settings-item-label">
            <SettingsIcon bgColor="#FF453A"><TrashIcon /></SettingsIcon>
            <span style={{ color: 'var(--accent-danger)' }}>{t('settings_delete_all')}</span>
          </div>
        </button>
      </div>

      {/* Modals */}
      <Modal isOpen={activeModal === 'auth'} onClose={() => setActiveModal(null)} title={t('auth_title')}>
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p>{t('auth_logged_in_as')} <strong>{user.email}</strong></p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              クラウド同期が有効です。データは自動的にバックアップ・同期されます。
            </p>
            <button className="btn-primary" style={{ backgroundColor: 'var(--accent-danger)' }} onClick={handleLogout}>{t('auth_logout')}</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {(!supabase) && (
              <p style={{ color: 'var(--accent-danger)', fontSize: '0.9rem', margin: 0 }}>
                Supabaseの環境変数が設定されていません。`.env.local` を確認してください。
              </p>
            )}
            <div className="input-group">
              <label>{t('auth_email')}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            </div>
            <div className="input-group">
              <label>{t('auth_password')}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button className="btn-primary" onClick={handleLogin} disabled={authLoading || !supabase} style={{ flex: 1 }}>
                {authLoading ? '...' : t('auth_login')}
              </button>
              <button className="btn-secondary" onClick={handleSignUp} disabled={authLoading || !supabase} style={{ flex: 1 }}>
                {authLoading ? '...' : t('auth_signup')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={activeModal === 'language'} onClose={() => setActiveModal(null)} title={t('settings_language')}>
        <div className="language-toggle" style={{ marginBottom: 0 }}>
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => switchLanguage('en')}>English</button>
          <button className={`lang-btn ${lang === 'ja' ? 'active' : ''}`} onClick={() => switchLanguage('ja')}>日本語</button>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'apiKey'} onClose={() => setActiveModal(null)} title={t('settings_api_key')}>
        <p className="hint">{t('settings_api_key_hint')}</p>
        <div className="input-group">
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="API Key"
          />
        </div>
        <button className="btn-primary btn-full" onClick={() => { handleApiKeySave(); setActiveModal(null); }}>{t('common_save')}</button>
      </Modal>

      <Modal isOpen={activeModal === 'nutrition'} onClose={() => setActiveModal(null)} title={t('settings_nutrition_goals')}>
        <div className="goals-grid">
          {[
            { key: 'calories', label: t('nutrient_calories'), unit: 'kcal' },
            { key: 'protein', label: t('nutrient_protein'), unit: 'g' },
            { key: 'fat', label: t('nutrient_fat'), unit: 'g' },
            { key: 'carbs', label: t('nutrient_carbs'), unit: 'g' },
          ].map(item => (
            <div key={item.key} className="goal-input-group">
              <label>{item.label} ({item.unit})</label>
              <input
                type="number"
                value={goals[item.key]}
                onChange={e => handleGoalChange(item.key, e.target.value)}
                inputMode="numeric"
                min="0"
              />
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'gyms'} onClose={() => setActiveModal(null)} title={t('settings_gyms')}>
        <div className="add-row">
          <input
            type="text"
            value={newGymName}
            onChange={e => setNewGymName(e.target.value)}
            placeholder={t('settings_gym_name')}
          />
          <button className="btn-primary btn-sm" onClick={handleAddGym}>{t('settings_add_gym')}</button>
        </div>
        {gyms.map(gym => (
          <GymCard
            key={gym.id}
            gym={gym}
            onDeleteGym={handleDeleteGym}
            onUpdateMachine={handleUpdateMachine}
          />
        ))}
      </Modal>

      {toast && <div className="toast">{toast}</div>}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        message={
          confirmState.type === 'export' ? t('settings_export_confirm') :
          confirmState.type === 'import' ? t('settings_import_confirm') :
          confirmState.type === 'delete' ? t('settings_delete_confirm') : ''
        }
        onConfirm={confirmAction}
        onCancel={cancelAction}
        confirmText={t('common_yes')}
        cancelText={t('common_no')}
        isDanger={confirmState.type === 'delete'}
      />
    </div>
  );
}
