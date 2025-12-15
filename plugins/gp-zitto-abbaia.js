// gp-accuccia-abbaia.js
// Plugin handler-style
// Comandi: .accuccia / .abbaia
// Solo admin gruppo

// 🔇 mute globale (se vuoi per-gruppo te lo faccio)
let mutedUsers = new Set()

let handler = async (m, { conn, command }) => {
  if (!m.isGroup) return

  // 🔹 controllo admin
  if (!m.isAdmin) {
    return m.reply('🚫 Solo gli *admin* possono usare questo comando.')
  }

  // 🔹 target: reply o mention
  let target = m.mentionedJid?.[0] || m.quoted?.sender
  if (!target) {
    return m.reply('❗ Usa il comando rispondendo a un messaggio o menzionando un utente.')
  }

  // ❌ no auto-mute
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
      { text: `🛑 @${target.split('@')[0]} è stato messo *A CUCCIA*.`, mentions: [target] },
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
      { text: `🗣️ @${target.split('@')[0]} può *ABBAIARE* di nuovo.`, mentions: [target] },
      { quoted: m }
    )
  }
}

// 🔹 BLOCCA I MESSAGGI DEI MUTATI
handler.before = async (m) => {
  if (!m.isGroup) return
  if (mutedUsers.has(m.sender)) {
    await m.delete()
    return true
  }
}

handler.command = ['accuccia', 'abbaia']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
