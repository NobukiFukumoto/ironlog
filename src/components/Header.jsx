import { useLanguage } from '../i18n/LanguageContext';

export default function Header({ titleKey }) {
  const { t } = useLanguage();

  return (
    <header className="app-header">
      <img src="/logo.svg" alt="IronLog" className="header-logo" />
      <h1>{titleKey ? t(titleKey) : 'IronLog'}</h1>
    </header>
  );
}
