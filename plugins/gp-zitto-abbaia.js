// gp-accuccia-abbaia.js
// Comandi: .accuccia / .abbaia
// Solo admin gruppo

let mutedUsers = new Set()

let handler = async (m, { conn, command, participants }) => {
  if (!m.isGroup) return

  // ✅ controllo admin CORRETTO
  const isAdmin = participants
    .filter(p => p.admin)
    .map(p => p.id)
    .includes(m.sender)

  if (!isAdmin) {
    return m.reply('🚫 Solo gli *admin* possono usare questo comando.')
  }

  // 🎯 target: reply o mention
  let target = m.mentionedJid?.[0] || m.quoted?.sender
  if (!target) {
    return m.reply('❗ Usa il comando rispondendo a un messaggio o menzionando un utente.')
  }

  if (target === m.sender) {
    return m.reply('😐 Non puoi farlo su te stesso.')
  }

  // 🔹 .accuccia
  if (command === 'accuccia') {
    if (mutedUsers.has(target)) {
      return conn.sendMessage(
        m.chat,
        { text: `🤐 @${target.split('@')[0]} è già a cuccia.`, mentions: [target] },
        { quoted: m }
      )
    }

    mutedUsers.add(target)
    return conn.sendMessage(
      m.chat,
      { text: `🛑 @${target.split('@')[0]} è stato messo *A CUCCIA*. 🐕`, mentions: [target] },
      { quoted: m }
    )
  }

  // 🔹 .abbaia
  if (command === 'abbaia') {
    if (!mutedUsers.has(target)) {
      return conn.sendMessage(
        m.chat,
        { text: `🐶 @${target.split('@')[0]} non era a cuccia.`, mentions: [target] },
        { quoted: m }
      )
    }

    mutedUsers.delete(target)
    return conn.sendMessage(
      m.chat,
      { text: `🗣️ @${target.split('@')[0]} può *ABBAIARE* di nuovo! 🔊`, mentions: [target] },
      { quoted: m }
    )
  }
}

// 🔇 blocco messaggi utenti mutati
handler.before = async (m) => {
  if (!m.isGroup) return
  if (mutedUsers.has(m.sender)) {
    await m.delete()
    return true
  }
}

handler.command = ['accuccia', 'abbaia']
handler.group = true
handler.botAdmin = true

export default handler
