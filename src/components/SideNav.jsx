import { useLanguage } from '../i18n/LanguageContext';
import { Icons } from './Icons';

const tabs = [
  { key: 'record', Icon: Icons.Dumbbell, labelKey: 'nav_record' },
  { key: 'favorites', Icon: Icons.Star, labelKey: 'nav_favorites' },
  { key: 'meals', Icon: Icons.Utensils, labelKey: 'nav_meals' },
  { key: 'history', Icon: Icons.Calendar, labelKey: 'nav_history' },
  { key: 'stats', Icon: Icons.Chart, labelKey: 'nav_stats' },
  { key: 'settings', Icon: Icons.Settings, labelKey: 'nav_settings' },
];

export default function SideNav({ active, onNavigate }) {
  const { t } = useLanguage();

  return (
    <nav className="side-nav">
      <div className="side-nav-header">
        <h1>IronLog</h1>
      </div>
      <div className="side-nav-items">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`side-nav-item ${active === tab.key ? 'active' : ''}`}
            onClick={() => onNavigate(tab.key)}
          >
            <span className="side-nav-icon">
              <tab.Icon width={24} height={24} />
            </span>
            <span className="side-nav-label">{t(tab.labelKey)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
