// Gemini API wrapper for food photo recognition

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function analyzeFoodPhoto(base64Image, apiKey, lang = 'en') {
  if (!apiKey) {
    throw new Error('API key is not set. Please set your Gemini API key in Settings.');
  }

  const langInstruction = lang === 'ja'
    ? 'Return food names in Japanese.'
    : 'Return food names in English.';

  const prompt = `Analyze this food photo. Identify all food items visible. For each item, estimate the portion size in grams and provide nutritional information per that estimated serving.

${langInstruction}

Return ONLY a valid JSON array (no markdown, no explanation) with this structure:
[
  {
    "name": "food name",
    "servingGrams": 150,
    "calories": 250,
    "protein": 30,
    "fat": 8,
    "carbs": 12
  }
]

If you cannot identify any food items, return an empty array [].`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image,
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${err}`);
  }

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

  // Parse JSON from response (handle potential markdown wrapping)
  let jsonStr = text.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const foods = JSON.parse(jsonStr);
    return Array.isArray(foods) ? foods : [];
  } catch {
    console.error('Failed to parse Gemini response:', text);
    return [];
  }
}
