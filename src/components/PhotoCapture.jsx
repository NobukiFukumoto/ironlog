import { useState, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { analyzeFoodPhoto } from '../utils/geminiApi';
import { getApiKey } from '../utils/storage';

export default function PhotoCapture({ onFoodsDetected }) {
  const { t, lang } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const handleCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setAnalyzing(true);

    try {
      // Show preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Convert to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const apiKey = getApiKey();
      const foods = await analyzeFoodPhoto(base64, apiKey, lang);

      if (foods.length === 0) {
        setError(t('meals_photo_error'));
      } else {
        onFoodsDetected(foods);
      }
    } catch (err) {
      setError(err.message || t('meals_photo_error'));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="photo-capture">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        style={{ display: 'none' }}
      />
      <button
        className="photo-capture-btn"
        onClick={() => fileRef.current?.click()}
        disabled={analyzing}
      >
        {analyzing ? (
          <>
            <span className="spinner" /> {t('meals_photo_analyzing')}
          </>
        ) : (
          <>{t('meals_photo_take')}</>
        )}
      </button>

      {preview && (
        <div className="photo-preview">
          <img src={preview} alt="Food" />
        </div>
      )}

      {error && <div className="photo-error">{error}</div>}
    </div>
  );
}
