import { useLanguage } from '../i18n/LanguageContext';

export default function Header({ titleKey }) {
  const { t } = useLanguage();

  return (
    <header className="app-header">
      <h1>{titleKey ? t(titleKey) : 'IronLog'}</h1>
    </header>
  );
}
