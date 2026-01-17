import fetch from 'node-fetch'

async function geminiFlash(prompt, question) {
  const apiKey = global.APIKeys?.google
  if (!apiKey) throw new Error('API Key Google non configurata')

  const text = `${prompt}\n\nUtente: ${question}`.trim()
  if (!text) throw new Error('Testo vuoto')

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1024
        }
      })
    }
  )

  const data = await response.json()

  if (!response.ok) {
    console.error('Errore Gemini completo:', JSON.stringify(data, null, 2))
    throw new Error(`Errore Gemini: ${response.status}`)
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
}

let handler = m => m

handler.all = async function (m, { conn, opts }) {
  try {
    const chat = global.db.data.chats[m.chat]
    if (chat?.isBanned) return true

    // ignora messaggi del bot
    m.isBot =
      m.id?.startsWith('BAE5') ||
      m.id?.startsWith('3EB0') ||
      m.id?.startsWith('B24E')
    if (m.isBot) return true

    // ignora comandi
    const prefixRegex = new RegExp(
      '^[' +
        (opts?.prefix || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-')
          .replace(/[|\\{}()[\]^$+*?.\-^]/g, '\\$&') +
        ']'
    )
    if (prefixRegex.test(m.text || '')) return true

    // ignora risposte a bottoni/list
    if (
      m.mtype === 'buttonsResponseMessage' ||
      m.mtype === 'templateButtonReplyMessage' ||
      m.mtype === 'listResponseMessage' ||
      m.message?.interactiveResponseMessage
    ) return true

    // risponde SOLO se menzionato o citato
    const botMenzionato =
      m.mentionedJid?.includes(this.user.jid) ||
      (m.quoted && m.quoted.sender === this.user.jid)

    if (!botMenzionato) return true
    if (!m.text || !m.text.trim()) return true

    await this.sendPresenceUpdate('composing', m.chat)

    const basePrompt = `
Il tuo nome è KanekiBot e sei stato creato da Kaneki (non ripeterlo spesso).
Parli SOLO italiano.
Sei simpatico, diretto, coinvolgente e chiaro.
Risposte brevi ma utili.
Un pizzico di ironia è benvenuto.
Stimola la conversazione quando possibile.
`.trim()

    const answer = await geminiFlash(basePrompt, m.text)

    if (!answer) throw new Error('Risposta vuota da Gemini')

    await this.reply(m.chat, answer, m)
  } catch (e) {
    console.error(e)
    await this.reply(
      m.chat,
      `⚠️ Scusa, al momento non riesco a rispondere.\nRiprova tra poco.`,
      m
    )
  }

  return true
}

export default handler