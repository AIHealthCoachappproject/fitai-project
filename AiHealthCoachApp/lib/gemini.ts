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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64,
      },
    },
    `วิเคราะห์อาหารในรูปนี้ ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น:
{
  "food_name": "ชื่ออาหารภาษาอังกฤษ",
  "food_name_th": "ชื่ออาหารภาษาไทย",
  "serving_size": "เช่น 1 จาน / 1 ชาม",
  "calories": 0,
  "protein_g": 0,
  "carbs_g": 0,
  "fat_g": 0,
  "confidence": 0.0
}`,
  ]);

  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text) as FoodAnalysis;
}
