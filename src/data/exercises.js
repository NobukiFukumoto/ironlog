// Default exercise library organized by category
// Each exercise has a key (language-independent) and bilingual names

export const CATEGORIES = [
  { key: "chest", names: { en: "Chest", ja: "胸" } },
  { key: "back", names: { en: "Back", ja: "背中" } },
  { key: "shoulders", names: { en: "Shoulders", ja: "肩" } },
  { key: "arms", names: { en: "Arms", ja: "腕" } },
  { key: "legs", names: { en: "Legs", ja: "脚" } },
  { key: "abs", names: { en: "Abs", ja: "腹" } },
  { key: "cardio", names: { en: "Cardio", ja: "有酸素" } },
  { key: "stretching", names: { en: "Stretching", ja: "ストレッチ" } },
];

export const DEFAULT_EXERCISES = [
  // Chest
  {
    key: "bench-press",
    category: "chest",
    type: "weight",
    names: { en: "Bench Press", ja: "ベンチプレス" },
  },
  {
    key: "incline-bench-press",
    category: "chest",
    type: "weight",
    names: { en: "Incline Bench Press", ja: "インクラインベンチプレス" },
  },
  {
    key: "decline-bench-press",
    category: "chest",
    type: "weight",
    names: { en: "Decline Bench Press", ja: "デクラインベンチプレス" },
  },
  {
    key: "dumbbell-fly",
    category: "chest",
    type: "weight",
    names: { en: "Dumbbell Fly", ja: "ダンベルフライ" },
  },
  {
    key: "cable-crossover",
    category: "chest",
    type: "weight",
    names: { en: "Cable Crossover", ja: "ケーブルクロスオーバー" },
  },
  {
    key: "chest-press-machine",
    category: "chest",
    type: "weight",
    names: { en: "Chest Press Machine", ja: "チェストプレスマシン" },
  },
  {
    key: "push-up",
    category: "chest",
    type: "weight",
    names: { en: "Push-up", ja: "腕立て伏せ" },
  },
  {
    key: "pec-deck",
    category: "chest",
    type: "weight",
    names: { en: "Pec Deck", ja: "ペックデック" },
  },

  // Back
  {
    key: "deadlift",
    category: "back",
    type: "weight",
    names: { en: "Deadlift", ja: "デッドリフト" },
  },
  {
    key: "lat-pulldown",
    category: "back",
    type: "weight",
    names: { en: "Lat Pulldown", ja: "ラットプルダウン" },
  },
  {
    key: "barbell-row",
    category: "back",
    type: "weight",
    names: { en: "Barbell Row", ja: "バーベルロウ" },
  },
  {
    key: "seated-cable-row",
    category: "back",
    type: "weight",
    names: { en: "Seated Cable Row", ja: "シーテッドケーブルロウ" },
  },
  {
    key: "dumbbell-row",
    category: "back",
    type: "weight",
    names: { en: "Dumbbell Row", ja: "ダンベルロウ" },
  },
  {
    key: "t-bar-row",
    category: "back",
    type: "weight",
    names: { en: "T-Bar Row", ja: "Tバーロウ" },
  },
  {
    key: "pull-up",
    category: "back",
    type: "weight",
    names: { en: "Pull-up", ja: "懸垂" },
  },
  {
    key: "back-extension",
    category: "back",
    type: "weight",
    names: { en: "Back Extension", ja: "バックエクステンション" },
  },

  // Shoulders
  {
    key: "overhead-press",
    category: "shoulders",
    type: "weight",
    names: { en: "Overhead Press", ja: "オーバーヘッドプレス" },
  },
  {
    key: "lateral-raise",
    category: "shoulders",
    type: "weight",
    names: { en: "Lateral Raise", ja: "サイドレイズ" },
  },
  {
    key: "front-raise",
    category: "shoulders",
    type: "weight",
    names: { en: "Front Raise", ja: "フロントレイズ" },
  },
  {
    key: "rear-delt-fly",
    category: "shoulders",
    type: "weight",
    names: { en: "Rear Delt Fly", ja: "リアデルトフライ" },
  },
  {
    key: "arnold-press",
    category: "shoulders",
    type: "weight",
    names: { en: "Arnold Press", ja: "アーノルドプレス" },
  },
  {
    key: "shoulder-press-machine",
    category: "shoulders",
    type: "weight",
    names: { en: "Shoulder Press Machine", ja: "ショルダープレスマシン" },
  },
  {
    key: "face-pull",
    category: "shoulders",
    type: "weight",
    names: { en: "Face Pull", ja: "フェイスプル" },
  },
  {
    key: "shrug",
    category: "shoulders",
    type: "weight",
    names: { en: "Shrug", ja: "シュラッグ" },
  },

  // Arms
  {
    key: "barbell-curl",
    category: "arms",
    type: "weight",
    names: { en: "Barbell Curl", ja: "バーベルカール" },
  },
  {
    key: "dumbbell-curl",
    category: "arms",
    type: "weight",
    names: { en: "Dumbbell Curl", ja: "ダンベルカール" },
  },
  {
    key: "hammer-curl",
    category: "arms",
    type: "weight",
    names: { en: "Hammer Curl", ja: "ハンマーカール" },
  },
  {
    key: "tricep-pushdown",
    category: "arms",
    type: "weight",
    names: { en: "Tricep Pushdown", ja: "トライセプスプッシュダウン" },
  },
  {
    key: "skull-crusher",
    category: "arms",
    type: "weight",
    names: { en: "Skull Crusher", ja: "スカルクラッシャー" },
  },
  {
    key: "dip",
    category: "arms",
    type: "weight",
    names: { en: "Dip", ja: "ディップ" },
  },
  {
    key: "concentration-curl",
    category: "arms",
    type: "weight",
    names: { en: "Concentration Curl", ja: "コンセントレーションカール" },
  },
  {
    key: "overhead-tricep-ext",
    category: "arms",
    type: "weight",
    names: {
      en: "Overhead Tricep Extension",
      ja: "オーバーヘッドトライセプスEXT",
    },
  },

  // Legs
  {
    key: "squat",
    category: "legs",
    type: "weight",
    names: { en: "Squat", ja: "スクワット" },
  },
  {
    key: "leg-press",
    category: "legs",
    type: "weight",
    names: { en: "Leg Press", ja: "レッグプレス" },
  },
  {
    key: "leg-curl",
    category: "legs",
    type: "weight",
    names: { en: "Leg Curl", ja: "レッグカール" },
  },
  {
    key: "leg-extension",
    category: "legs",
    type: "weight",
    names: { en: "Leg Extension", ja: "レッグエクステンション" },
  },
  {
    key: "romanian-deadlift",
    category: "legs",
    type: "weight",
    names: { en: "Romanian Deadlift", ja: "ルーマニアンデッドリフト" },
  },
  {
    key: "lunge",
    category: "legs",
    type: "weight",
    names: { en: "Lunge", ja: "ランジ" },
  },
  {
    key: "calf-raise",
    category: "legs",
    type: "weight",
    names: { en: "Calf Raise", ja: "カーフレイズ" },
  },
  {
    key: "hip-thrust",
    category: "legs",
    type: "weight",
    names: { en: "Hip Thrust", ja: "ヒップスラスト" },
  },

  // Abs
  {
    key: "crunch",
    category: "abs",
    type: "weight",
    names: { en: "Crunch", ja: "クランチ" },
  },
  {
    key: "plank",
    category: "abs",
    type: "weight",
    names: { en: "Plank", ja: "プランク" },
  },
  {
    key: "leg-raise-abs",
    category: "abs",
    type: "weight",
    names: { en: "Leg Raise", ja: "レッグレイズ" },
  },
  {
    key: "ab-wheel",
    category: "abs",
    type: "weight",
    names: { en: "Ab Wheel", ja: "アブローラー" },
  },
  {
    key: "cable-crunch",
    category: "abs",
    type: "weight",
    names: { en: "Cable Crunch", ja: "ケーブルクランチ" },
  },
  {
    key: "russian-twist",
    category: "abs",
    type: "weight",
    names: { en: "Russian Twist", ja: "ロシアンツイスト" },
  },

  // Cardio
  {
    key: "treadmill",
    category: "cardio",
    type: "cardio",
    names: { en: "Treadmill", ja: "トレッドミル" },
  },
  {
    key: "elliptical",
    category: "cardio",
    type: "cardio",
    names: { en: "Elliptical", ja: "エリプティカル" },
  },
  {
    key: "stationary-bike",
    category: "cardio",
    type: "cardio",
    names: { en: "Stationary Bike", ja: "エアロバイク" },
  },
  {
    key: "rowing-machine",
    category: "cardio",
    type: "cardio",
    names: { en: "Rowing Machine", ja: "ローイングマシン" },
  },
  {
    key: "stair-climber",
    category: "cardio",
    type: "cardio",
    names: { en: "Stair Climber", ja: "ステアクライマー" },
  },
  {
    key: "jump-rope",
    category: "cardio",
    type: "cardio",
    names: { en: "Jump Rope", ja: "縄跳び" },
  },
  {
    key: "running-outdoor",
    category: "cardio",
    type: "cardio",
    names: { en: "Running (Outdoor)", ja: "ランニング（屋外）" },
  },
  {
    key: "swimming",
    category: "cardio",
    type: "cardio",
    names: { en: "Swimming", ja: "水泳" },
  },

  // Stretching
  {
    key: "hamstring-stretch",
    category: "stretching",
    type: "stretching",
    names: { en: "Hamstring Stretch", ja: "ハムストリングストレッチ" },
  },
  {
    key: "quad-stretch",
    category: "stretching",
    type: "stretching",
    names: { en: "Quad Stretch", ja: "大腿四頭筋ストレッチ" },
  },
  {
    key: "hip-flexor-stretch",
    category: "stretching",
    type: "stretching",
    names: { en: "Hip Flexor Stretch", ja: "股関節屈筋ストレッチ" },
  },
  {
    key: "shoulder-stretch",
    category: "stretching",
    type: "stretching",
    names: { en: "Shoulder Stretch", ja: "肩ストレッチ" },
  },
  {
    key: "chest-stretch",
    category: "stretching",
    type: "stretching",
    names: { en: "Chest Stretch", ja: "胸ストレッチ" },
  },
  {
    key: "calf-stretch",
    category: "stretching",
    type: "stretching",
    names: { en: "Calf Stretch", ja: "ふくらはぎストレッチ" },
  },
  {
    key: "neck-stretch",
    category: "stretching",
    type: "stretching",
    names: { en: "Neck Stretch", ja: "首ストレッチ" },
  },
  {
    key: "back-stretch",
    category: "stretching",
    type: "stretching",
    names: { en: "Back Stretch", ja: "背中ストレッチ" },
  },
  {
    key: "foam-rolling",
    category: "stretching",
    type: "stretching",
    names: { en: "Foam Rolling", ja: "フォームローリング" },
  },
];
