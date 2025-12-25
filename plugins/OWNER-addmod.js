// Lista dei creator/owner autorizzati
const owners = [
  '447529688238@s.whatsapp.net', // creatore
  '447529503948@s.whatsapp.net', // vixiie
  '48726875208@s.whatsapp.net',   // vampexe
  '212775499775@s.whatsapp.net'   // hell
]

// Moderatori per chat
const groupMods = {} // { chatId: [jid1, jid2, ...] }

let handler = async (m, { conn, command, mentionedJid }) => {
  const chat = m.chat
  const sender = m.sender

  // Controllo owner
  if (!owners.includes(sender)) return m.reply('❌ Solo l’owner può usare questo comando')

  // Inizializza array dei moderatori della chat
  if (!groupMods[chat]) groupMods[chat] = []

  switch (command) {
    case 'addmod':
      if (!mentionedJid || mentionedJid.length === 0) return m.reply('Usa: .addmod @utente')
      for (let user of mentionedJid) {
        if (!groupMods[chat].includes(user)) {
          groupMods[chat].push(user)
        }
      }
      return m.reply(`✅ Moderatore/i aggiunto/i con successo:\n${mentionedJid.map(u => '@'+u.split('@')[0]).join('\n')}`, null, { mentions: mentionedJid })

    case 'removemod':
      if (!mentionedJid || mentionedJid.length === 0) return m.reply('Usa: .removemod @utente')
      for (let user of mentionedJid) {
        groupMods[chat] = groupMods[chat].filter(u => u !== user)
      }
      return m.reply(`✅ Moderatore/i rimosso/i con successo:\n${mentionedJid.map(u => '@'+u.split('@')[0]).join('\n')}`, null, { mentions: mentionedJid })

    case 'tagmod':
      if (!groupMods[chat] || groupMods[chat].length === 0) return m.reply('❌ Nessun moderatore in questo gruppo')
      const mentions = groupMods[chat]
      const text = '👥 Moderatori del gruppo:\n\n' + mentions.map(u => `• @${u.split('@')[0]}`).join('\n')
      return conn.sendMessage(chat, { text, mentions })
  }
}

handler.command = ['addmod','removemod','tagmod']
handler.group = true
export default handler