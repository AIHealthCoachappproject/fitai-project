import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

const SYSTEM_PROMPT = `
คุณคือ FitAI โค้ชสุขภาพ AI ที่พูดภาษาไทย
ตอบสั้น กระชับ เป็นกันเอง เข้าใจอาหารและวัฒนธรรมไทย
แนะนำอาหารราคาประหยัดได้ งบ 150 บาท/วัน ก็ช่วยได้
`

export async function chatWithGemini(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[]
) {
  const chat = model.startChat({
    history: history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    systemInstruction: SYSTEM_PROMPT,
  })
  const result = await chat.sendMessage(userMessage)
  return result.response.text()
}
