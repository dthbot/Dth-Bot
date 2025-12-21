import fetch from 'node-fetch'

const API_KEYS = [
  "AIzaSyC_3aCK0G894f8LbeGNEXVwQA9Fcpp1Ci8",
  "AIzaSyCXOXepZsNuxH0ChqsuO6gJQIc8wPyrl5Q"
]

// ===============================
// FUNZIONE GEMINI
// ===============================
async function queryGemini(prompt) {
  for (let i = 0; i < API_KEYS.length; i++) {
    const key = API_KEYS[i]

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      )

      if (!response.ok) {
        const err = await response.text()
        console.error(`❌ Gemini key ${i + 1} errore:`, err)
        continue
      }

      const data = await response.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (reply) return reply

    } catch (e) {
      console.warn(`⚠️ Gemini key ${i + 1} non valida`)
    }
  }

  return "❌ Gemini non ha risposto. Riprova più tardi."
}

// ===============================
// HANDLER
// ===============================
var handler = async (m, { conn, text }) => {
  if (!text) {
    return m.reply("✏️ Scrivi qualcosa dopo il comando.\nEsempio: .ia ciao")
  }

  try {
    await conn.sendPresenceUpdate('composing', m.chat)

    const reply = await queryGemini(text)
    await m.reply(reply)

  } catch (e) {
    console.error(e)
    await m.reply("⚠️ Errore durante la richiesta a Gemini.")
  }
}

// ===============================
// CONFIG COMANDI
// ===============================
handler.command = ['ia', 'gemini']
handler.tags = ['tools']
handler.help = ['ia <testo>']
handler.premium = false

export default handler
