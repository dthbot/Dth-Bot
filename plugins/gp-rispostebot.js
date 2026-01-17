import fetch from 'node-fetch'

async function lolhumanChat(text) {
  const apiUrl = global.APIs?.lol
  if (!apiUrl) throw new Error('API LOLHUMAN non configurata (global.APIs.lol)')

  const apiKey = global.APIKeys?.[apiUrl]
  if (!apiKey) throw new Error('API Key LOLHUMAN non configurata')

  const url =
    `${apiUrl}/api/ai?apikey=${apiKey}&text=${encodeURIComponent(text)}`

  let response
  try {
    response = await fetch(url)
  } catch (e) {
    throw new Error('Errore di rete verso LOLHUMAN')
  }

  const data = await response.json()

  if (!response.ok || !data?.result) {
    console.error('ERRORE LOLHUMAN:', JSON.stringify(data, null, 2))
    throw new Error('Risposta non valida da LOLHUMAN')
  }

  return data.result.trim()
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

    // ignora pulsanti / liste
    if (
      m.mtype === 'buttonsResponseMessage' ||
      m.mtype === 'templateButtonReplyMessage' ||
      m.mtype === 'listResponseMessage' ||
      m.message?.interactiveResponseMessage
    ) return true

    // risponde solo se menzionato o citato
    const botMenzionato =
      m.mentionedJid?.includes(this.user.jid) ||
      (m.quoted && m.quoted.sender === this.user.jid)

    if (!botMenzionato) return true
    if (!m.text || !m.text.trim()) return true

    await this.sendPresenceUpdate('composing', m.chat)

    const answer =
      (await lolhumanChat(m.text)) ||
      '🤔 Non ho capito bene, puoi riformulare?'

    await this.reply(m.chat, answer, m)
  } catch (e) {
    console.error('ERRORE KANEKIBOT:', e)

    await this.reply(
      m.chat,
      '⚠️ Scusa, al momento non riesco a rispondere.\nRiprova tra poco.',
      m
    )
  }

  return true
}

export default handler