import { useLanguage } from '../i18n/LanguageContext';
import { Icons } from './Icons';

const tabs = [
  { key: 'record', Icon: Icons.Dumbbell, labelKey: 'nav_record' },
  { key: 'meals', Icon: Icons.Utensils, labelKey: 'nav_meals' },
  { key: 'history', Icon: Icons.Calendar, labelKey: 'nav_history' },
  { key: 'stats', Icon: Icons.Chart, labelKey: 'nav_stats' },
  { key: 'settings', Icon: Icons.Settings, labelKey: 'nav_settings' },
];

export default function BottomNav({ active, onNavigate }) {
  const { t } = useLanguage();

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={`bottom-nav-item ${active === tab.key ? 'active' : ''}`}
          onClick={() => onNavigate(tab.key)}
        >
          <span className="bottom-nav-icon">
            <tab.Icon width={24} height={24} />
          </span>
          <span className="bottom-nav-label">{t(tab.labelKey)}</span>
        </button>
      ))}
    </nav>
  );
}
