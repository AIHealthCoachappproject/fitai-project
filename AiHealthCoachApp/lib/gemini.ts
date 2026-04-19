import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

export interface FoodAnalysis {
  food_name: string;
  food_name_th: string;
  serving_size: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence: number;
}

export async function analyzeFoodImage(base64: string): Promise<FoodAnalysis> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64,
      },
    },
    `Analyze the food in this image. Return ONLY a valid JSON object. Do not include any markdown, explanations, backticks, or code fences. Your entire response must be parseable by JSON.parse().

Required format:
{"food_name":"English food name","food_name_th":"ชื่ออาหารภาษาไทย","serving_size":"e.g. 1 plate","calories":0,"protein_g":0,"carbs_g":0,"fat_g":0,"confidence":0.0}`,
  ]);

  const raw = result.response.text();
  console.log('[Gemini] raw response:', raw);

  // Strip markdown code fences and any leading/trailing whitespace
  const text = raw.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();

  // Extract JSON object in case there is surrounding text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`No JSON object found in response: ${text}`);
  }

  return JSON.parse(jsonMatch[0]) as FoodAnalysis;
}
