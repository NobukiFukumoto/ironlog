// Default food database with nutrition per 100g
// Bilingual names (EN / JA)

export const DEFAULT_FOODS = [
  { key: 'white-rice', names: { en: 'White Rice', ja: '白米' }, per100g: { calories: 168, protein: 2.7, fat: 0.3, carbs: 37 } },
  { key: 'brown-rice', names: { en: 'Brown Rice', ja: '玄米' }, per100g: { calories: 123, protein: 2.7, fat: 1, carbs: 26 } },
  { key: 'chicken-breast', names: { en: 'Chicken Breast', ja: '鶏むね肉' }, per100g: { calories: 165, protein: 31, fat: 3.6, carbs: 0 } },
  { key: 'chicken-thigh', names: { en: 'Chicken Thigh', ja: '鶏もも肉' }, per100g: { calories: 209, protein: 26, fat: 11, carbs: 0 } },
  { key: 'egg', names: { en: 'Egg (whole)', ja: '卵' }, per100g: { calories: 155, protein: 13, fat: 11, carbs: 1.1 } },
  { key: 'salmon', names: { en: 'Salmon', ja: 'サーモン' }, per100g: { calories: 208, protein: 20, fat: 13, carbs: 0 } },
  { key: 'tuna', names: { en: 'Tuna', ja: 'ツナ' }, per100g: { calories: 132, protein: 28, fat: 1.3, carbs: 0 } },
  { key: 'beef-lean', names: { en: 'Lean Beef', ja: '牛赤身肉' }, per100g: { calories: 250, protein: 26, fat: 15, carbs: 0 } },
  { key: 'pork-loin', names: { en: 'Pork Loin', ja: '豚ロース' }, per100g: { calories: 242, protein: 27, fat: 14, carbs: 0 } },
  { key: 'tofu', names: { en: 'Tofu', ja: '豆腐' }, per100g: { calories: 76, protein: 8, fat: 4.8, carbs: 1.9 } },
  { key: 'natto', names: { en: 'Natto', ja: '納豆' }, per100g: { calories: 212, protein: 17, fat: 11, carbs: 14 } },
  { key: 'banana', names: { en: 'Banana', ja: 'バナナ' }, per100g: { calories: 89, protein: 1.1, fat: 0.3, carbs: 23 } },
  { key: 'apple', names: { en: 'Apple', ja: 'りんご' }, per100g: { calories: 52, protein: 0.3, fat: 0.2, carbs: 14 } },
  { key: 'sweet-potato', names: { en: 'Sweet Potato', ja: 'さつまいも' }, per100g: { calories: 86, protein: 1.6, fat: 0.1, carbs: 20 } },
  { key: 'broccoli', names: { en: 'Broccoli', ja: 'ブロッコリー' }, per100g: { calories: 34, protein: 2.8, fat: 0.4, carbs: 7 } },
  { key: 'oatmeal', names: { en: 'Oatmeal', ja: 'オートミール' }, per100g: { calories: 389, protein: 17, fat: 6.9, carbs: 66 } },
  { key: 'greek-yogurt', names: { en: 'Greek Yogurt', ja: 'ギリシャヨーグルト' }, per100g: { calories: 59, protein: 10, fat: 0.7, carbs: 3.6 } },
  { key: 'milk', names: { en: 'Milk', ja: '牛乳' }, per100g: { calories: 61, protein: 3.2, fat: 3.3, carbs: 4.8 } },
  { key: 'whey-protein', names: { en: 'Whey Protein', ja: 'プロテイン' }, per100g: { calories: 400, protein: 80, fat: 3.3, carbs: 10 } },
  { key: 'peanut-butter', names: { en: 'Peanut Butter', ja: 'ピーナッツバター' }, per100g: { calories: 588, protein: 25, fat: 50, carbs: 20 } },
  { key: 'avocado', names: { en: 'Avocado', ja: 'アボカド' }, per100g: { calories: 160, protein: 2, fat: 15, carbs: 9 } },
  { key: 'bread-white', names: { en: 'White Bread', ja: '食パン' }, per100g: { calories: 265, protein: 9, fat: 3.2, carbs: 49 } },
  { key: 'pasta', names: { en: 'Pasta (cooked)', ja: 'パスタ（茹で）' }, per100g: { calories: 131, protein: 5, fat: 1.1, carbs: 25 } },
  { key: 'miso-soup', names: { en: 'Miso Soup', ja: '味噌汁' }, per100g: { calories: 40, protein: 3, fat: 1, carbs: 5 } },
  { key: 'salad-mixed', names: { en: 'Mixed Salad', ja: 'ミックスサラダ' }, per100g: { calories: 20, protein: 1.5, fat: 0.2, carbs: 3.5 } },
  { key: 'almonds', names: { en: 'Almonds', ja: 'アーモンド' }, per100g: { calories: 579, protein: 21, fat: 50, carbs: 22 } },
  { key: 'cheese', names: { en: 'Cheese (Cheddar)', ja: 'チーズ（チェダー）' }, per100g: { calories: 403, protein: 25, fat: 33, carbs: 1.3 } },
  { key: 'olive-oil', names: { en: 'Olive Oil', ja: 'オリーブオイル' }, per100g: { calories: 884, protein: 0, fat: 100, carbs: 0 } },
];

export const DEFAULT_NUTRITION_GOALS = {
  calories: 2500,
  protein: 150,
  fat: 70,
  carbs: 300,
};
