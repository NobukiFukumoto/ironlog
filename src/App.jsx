import { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import SideNav from './components/SideNav';
import Record from './pages/Record';
import Meals from './pages/Meals';
import History from './pages/History';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import './index.css';

function AppContent() {
  const [page, setPage] = useState('record');

  const renderPage = () => {
    switch (page) {
      case 'record': return <Record />;
      case 'meals': return <Meals />;
      case 'history': return <History />;
      case 'stats': return <Stats />;
      case 'settings': return <Settings />;
      default: return <Record />;
    }
  };

  return (
    <div className="app">
      <SideNav active={page} onNavigate={setPage} />
      <div className="app-main">
        <Header />
        <main className="app-content">
          {renderPage()}
        </main>
      </div>
      <BottomNav active={page} onNavigate={setPage} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
