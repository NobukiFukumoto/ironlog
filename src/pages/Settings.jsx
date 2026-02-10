import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getGyms, saveGym, deleteGym,
  getNutritionGoals, saveNutritionGoals,
  getApiKey, saveApiKey,
  exportAllData, importAllData, deleteAllData,
} from '../utils/storage';
import GymCard from '../components/GymCard';

export default function Settings() {
  const { t, lang, switchLanguage } = useLanguage();
  const [gyms, setGyms] = useState(() => getGyms());
  const [goals, setGoals] = useState(() => getNutritionGoals());
  const [apiKey, setApiKey] = useState(() => getApiKey());
  const [newGymName, setNewGymName] = useState('');
  const [toast, setToast] = useState('');

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
  const handleDeleteAll = () => {
    if (confirm(t('settings_delete_confirm'))) {
      deleteAllData();
      setGyms([]);
      setGoals(getNutritionGoals());
      setApiKey('');
      showToast(t('settings_deleted'));
    }
  };

  return (
    <div className="page settings-page">
      <h1 className="page-title">{t('settings_title')}</h1>

      {/* Language */}
      <div className="settings-section">
        <h3>{t('settings_language')}</h3>
        <div className="language-toggle">
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => switchLanguage('en')}>English</button>
          <button className={`lang-btn ${lang === 'ja' ? 'active' : ''}`} onClick={() => switchLanguage('ja')}>日本語</button>
        </div>
      </div>

      {/* Gemini API Key */}
      <div className="settings-section">
        <h3>{t('settings_api_key')}</h3>
        <p className="hint">{t('settings_api_key_hint')}</p>
        <div className="api-key-row">
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="API Key"
          />
          <button className="btn-primary btn-sm" onClick={handleApiKeySave}>{t('common_save')}</button>
        </div>
      </div>

      {/* Nutrition Goals */}
      <div className="settings-section">
        <h3>{t('settings_nutrition_goals')}</h3>
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
      </div>

      {/* Gym management */}
      <div className="settings-section">
        <h3>{t('settings_gyms')}</h3>
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
      </div>

      {/* Data management */}
      <div className="settings-section">
        <button className="btn-secondary btn-full" onClick={handleExport}>📤 {t('settings_export')}</button>
        <button className="btn-secondary btn-full" onClick={handleImport}>📥 {t('settings_import')}</button>
        <button className="btn-danger btn-full" onClick={handleDeleteAll}>🗑️ {t('settings_delete_all')}</button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
