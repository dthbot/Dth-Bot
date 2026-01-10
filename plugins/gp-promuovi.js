let handler = async (m, { conn, text }) => {
  let user

  // 1️⃣ Se c'è una mention (.p @utente)
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    user = m.mentionedJid[0]

  // 2️⃣ Se si risponde a un messaggio
  } else if (m.quoted) {
    user = m.quoted.sender

  // 3️⃣ Se si usa il numero (.p 393xxx)
  } else if (text && !isNaN(text)) {
    if (text.length < 11 || text.length > 13) return
    user = text + '@s.whatsapp.net'
  }

  if (!user) return m.reply('❌ Tagga un utente, rispondi a un messaggio o scrivi il numero')

  await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
  m.reply('✅ Utente promosso ad admin')
}

handler.command = /^(p|promuovi|mettiadmin)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler