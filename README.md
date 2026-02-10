# Workout Record App (筋トレ記録アプリ)

A local Android PWA for tracking workouts, meals, and body weight. Features AI-powered food photo recognition, detailed stats, and offline support.

## Features
- **Workouts**: Weight training, cardio, stretching.
- **Meals**: Log meals manually or via AI photo recognition (Gemini API).
- **Stats**: Visual dashboards for progress tracking.
- **PWA**: Installable on Android/iOS, works offline (except AI features).
- **Privacy**: All data stored locally on your device.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Access at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
npm run preview
```

## How to Install on Android

1. Ensure your PC and Android phone are on the same Wi-Fi network.
2. Run `npm run dev -- --host` on your PC.
3. Open Chrome on Android and go to `http://<YOUR-PC-IP>:5173`.
4. Tap the browser menu (⋮) -> **"Add to Home Screen"** (or "Install App").
5. Launch from home screen for full-screen PWA experience.

## Setting Up AI Food Recognition

To use the photo recognition feature:
1. Go to **Settings** in the app.
2. Enter your **Gemini API Key**.
   - Get a free key at: [aistudio.google.com](https://aistudio.google.com/app/apikey)
3. Save.

## Technologies
- React + Vite
- Chart.js
- LocalStorage
- Gemini API (gemini-2.0-flash)
