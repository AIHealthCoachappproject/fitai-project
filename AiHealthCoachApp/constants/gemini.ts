import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `
คุณคือ FitAI โค้ชสุขภาพ AI ที่พูดภาษาไทย
ตอบสั้น กระชับ เป็นกันเอง เข้าใจอาหารและวัฒนธรรมไทย
แนะนำอาหารราคาประหยัดได้ งบ 150 บาท/วัน ก็ช่วยได้
`

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: SYSTEM_PROMPT,
})

export async function chatWithGemini(
  userMessage: string,
  history: { role: 'user' | 'assistant'; content: string }[]
) {
  try {
    const apiHistory = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    // Gemini SDK requires history to start with a 'user' turn.
    // Drop any leading 'model' messages (UI greeting) from the API payload.
    while (apiHistory.length > 0 && apiHistory[0].role === 'model') {
      apiHistory.shift()
    }

    const chat = model.startChat({
      history: apiHistory,
    })
    const result = await chat.sendMessage(userMessage)
    return result.response.text()
  } catch (error) {
    console.error('[Gemini API error]', error)
    throw error
  }
}
