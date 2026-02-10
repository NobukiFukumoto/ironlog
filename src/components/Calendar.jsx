import { useState, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Calendar({ selectedDate, onSelectDate, workoutDates = new Set(), mealDates = new Set() }) {
  const { t } = useLanguage();
  const [viewDate, setViewDate] = useState(() => {
    const d = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const days = useMemo(() => {
    const { year, month } = viewDate;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewDate]);

  const formatDate = (day) => {
    const m = String(viewDate.month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${viewDate.year}-${m}-${d}`;
  };

  const prevMonth = () => {
    setViewDate(v => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { ...v, month: v.month - 1 };
    });
  };

  const nextMonth = () => {
    setViewDate(v => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { ...v, month: v.month + 1 };
    });
  };

  const monthNames = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  };

  const dayNames = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ja: ['日', '月', '火', '水', '木', '金', '土'],
  };

  const { lang } = useLanguage();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>◀</button>
        <span className="calendar-title">
          {(monthNames[lang] || monthNames.en)[viewDate.month]} {viewDate.year}
        </span>
        <button className="calendar-nav-btn" onClick={nextMonth}>▶</button>
      </div>

      <div className="calendar-grid">
        {(dayNames[lang] || dayNames.en).map(day => (
          <div key={day} className="calendar-day-name">{day}</div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="calendar-cell empty" />;
          const dateStr = formatDate(day);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;
          const hasWorkout = workoutDates.has(dateStr);
          const hasMeal = mealDates.has(dateStr);

          return (
            <button
              key={dateStr}
              className={`calendar-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => onSelectDate(dateStr)}
            >
              <span className="calendar-day-num">{day}</span>
              <div className="calendar-dots">
                {hasWorkout && <span className="dot workout-dot" />}
                {hasMeal && <span className="dot meal-dot" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
