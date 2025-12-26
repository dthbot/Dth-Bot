let handler = async (m, { conn, command }) => {
  // Identifica l'utente da menzione o citazione
  let who

  if (m.isGroup)
    who = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : null
  else who = m.chat

  if (!who) return m.reply('⚠️ Per favore, tagga un utente.')

  // Crea l'oggetto utente se non esiste
  if (!global.db.data.users[who]) global.db.data.users[who] = {}

  let user = global.db.data.users[who]

  // Funzione helper per abbellire il messaggio
  const fancyReply = async (text) => {
    await conn.reply(
      m.chat,
      `═══════════════\n${text}\n═══════════════`,
      m,
      { mentions: [who] }
    )
  }

  // ================= BAN DAL BOT =================
  if (command === 'ban') {
    if (user.banned) return fancyReply('ℹ️ Utente già *bannato dal bot*.')

    user.banned = true

    await fancyReply(
      `⛔ @${who.split('@')[0]} è stato *BANNATO DAL BOT*\n❌ Non potrà più usare i comandi del bot.`
    )
  }

  // ================= UNBAN DAL BOT =================
  if (command === 'unban') {
    if (!user.banned) return fancyReply('ℹ️ Utente non è bannato.')

    user.banned = false

    await fancyReply(
      `✅ @${who.split('@')[0]} è stato *SBANNATO DAL BOT*\n✔️ Ora può usare di nuovo i comandi.`
    )
  }
}

// Impostazioni del comando
handler.help = ['ban', 'unban']
handler.command = ['ban', 'unban']
handler.admin = true

// ================= MIDDLEWARE =================
// Blocca i comandi per utenti bannati
handler.before = async function (m) {
  if (!m.text) return true
  let user = global.db.data.users[m.sender]
  if (user?.banned && m.text.startsWith('.')) {
    return false // Blocca comando
  }
  return true
}

export default handler