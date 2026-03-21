import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const PRESETS = [60, 90, 120];

export default function RestTimer({ autoExpand = false, autoStart = false, defaultSeconds = 60 }) {
  const { t } = useLanguage();
  const [totalSeconds, setTotalSeconds] = useState(defaultSeconds);
  const [remaining, setRemaining] = useState(defaultSeconds);
  const [running, setRunning] = useState(autoStart);
  const [showTimer, setShowTimer] = useState(autoExpand);
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const intervalRef = useRef(null);


  const playAlarm = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.frequency.value = 880;
      oscillator.type = 'sine';
      gain.gain.value = 0.5;
      oscillator.start();
      setTimeout(() => { oscillator.stop(); ctx.close(); }, 800);
    } catch (e) { console.warn('Audio not available', e); }
  }, []);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            setRunning(false);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining, playAlarm]);

  const startPause = () => {
    if (remaining === 0) {
      setRemaining(totalSeconds);
    }
    setRunning(!running);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(totalSeconds);
  };

  const selectPreset = (sec) => {
    setTotalSeconds(sec);
    setRemaining(sec);
    setRunning(false);
    setShowCustom(false);
  };

  const applyCustom = () => {
    const sec = parseInt(customInput);
    if (sec > 0) {
      selectPreset(sec);
      setCustomInput('');
    }
  };

  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const progress = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;

  return (
    <div className="rest-timer-wrapper">
      <button className="timer-toggle-btn" onClick={() => setShowTimer(!showTimer)}>
        {t('timer_title')}
      </button>

      {showTimer && (
        <div className="rest-timer">
          <div className="timer-presets-container">
            <div className="timer-presets">
              {PRESETS.map(sec => (
                <button
                  key={sec}
                  className={`timer-preset-btn ${totalSeconds === sec && !showCustom ? 'active' : ''}`}
                  onClick={() => selectPreset(sec)}
                >
                  {sec}s
                </button>
              ))}
              <button
                className={`timer-preset-btn ${showCustom ? 'active' : ''}`}
                onClick={() => setShowCustom(!showCustom)}
              >
                {t('timer_custom')}
              </button>
            </div>
          </div>

          {showCustom && (
            <div className="timer-custom-wrapper">
              <div className="timer-custom-input">
                <input
                  type="number"
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  placeholder="0"
                  inputMode="numeric"
                  min="1"
                  autoFocus
                />
                <span className="input-suffix">sec</span>
                <button className="timer-custom-set-btn" onClick={applyCustom}>
                  Set
                </button>
              </div>
            </div>
          )}

          <div className="timer-display">
            <div className="timer-circle" style={{ '--progress': `${progress}%` }}>
              <span className={`timer-time ${remaining === 0 ? 'timer-finished' : ''}`}>
                {remaining === 0 ? t('timer_finished') : `${min}:${sec.toString().padStart(2, '0')}`}
              </span>
            </div>
          </div>

          <div className="timer-controls">
            <button className="timer-btn" onClick={reset}>{t('timer_reset')}</button>
            <button className="timer-btn timer-btn-primary" onClick={startPause}>
              {running ? t('timer_pause') : t('timer_start')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
