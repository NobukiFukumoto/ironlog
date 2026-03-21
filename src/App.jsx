import { useState } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import SideNav from './components/SideNav';
import Record from './pages/Record';
import Favorites from './pages/Favorites';
import Meals from './pages/Meals';
import History from './pages/History';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import './index.css';
import { useEffect } from 'react';
import { syncFromCloud } from './utils/storage';
import { supabase } from './lib/supabase';

function AppContent() {
  const [page, setPage] = useState('record');

  useEffect(() => {
    if (!supabase) return;
    
    // Sync on initial load
    syncFromCloud();
    
    // Listen for auth changes to sync immediately after login
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') syncFromCloud();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lifted state for Record/Workout session
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [gymId, setGymId] = useState(null);
  const [exercises, setExercises] = useState([]);

  const handleAddToWorkout = (exercise) => {
    setExercises([...exercises, exercise]);
    setPage('record');
  };

  const renderPage = () => {
    switch (page) {
      case 'record': 
        return (
          <Record 
            date={date} 
            setDate={setDate} 
            gymId={gymId} 
            setGymId={setGymId} 
            exercises={exercises} 
            setExercises={setExercises} 
          />
        );
      case 'favorites':
        return <Favorites onAddToWorkout={handleAddToWorkout} />;
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
