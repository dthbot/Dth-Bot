async function handler(m, { isBotAdmin, text, conn }) {
  if (!isBotAdmin) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Devo essere admin per poter funzionare'
    }, { quoted: m })
  }

  // Recupera l'ID della persona da rimuovere
  const mention = m.mentionedJid?.[0] || m.quoted?.sender
  if (!mention) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Menziona la persona da rimuovere'
    }, { quoted: m })
  }

  const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

  if (mention === ownerBot) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Non puoi rimuovere il creatore del bot'
    }, { quoted: m })
  }

  if (mention === conn.user.jid) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Non puoi rimuovere il bot'
    }, { quoted: m })
  }

  if (mention === m.sender) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Non puoi rimuovere te stesso'
    }, { quoted: m })
  }

  // Recupera i partecipanti del gruppo
  const groupMetadata = conn.chats[m.chat]?.metadata
  const participants = groupMetadata?.participants || []

  const utente = participants.find(u => conn.decodeJid(u.id) === conn.decodeJid(mention))
  if (!utente) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ L’utente non è nel gruppo'
    }, { quoted: m })
  }

  // Controllo admin / superadmin
  if (utente.admin === 'superadmin') {
    return await conn.sendMessage(m.chat, {
      text: "ⓘ L'utente che hai provato a rimuovere è il creatore del gruppo"
    }, { quoted: m })
  }

  if (utente.admin === 'admin') {
    return await conn.sendMessage(m.chat, {
      text: "ⓘ L'utente che hai provato a rimuovere è admin"
    }, { quoted: m })
  }

  // Motivo opzionale
  const reason = text ? `\n\n𝐌𝐨𝐭𝐢𝐯𝐨: ${text.replace(/@\d+/g, '').trim()}` : ''

  // Notifica gruppo
  await conn.sendMessage(m.chat, {
    text: `@${mention.split`@`[0]} è stato rimosso dal gruppo da @${m.sender.split`@`[0]}${reason}`,
    mentions: [mention, m.sender]
  }, { quoted: m })

  // Rimuove l’utente
  try {
    await conn.groupParticipantsUpdate(m.chat, [mention], 'remove')
  } catch (e) {
    console.error('Errore durante la rimozione:', e)
    return await conn.sendMessage(m.chat, { text: '⚠️ Impossibile rimuovere l’utente' }, { quoted: m })
  }
}

// Comandi per attivare il kick
handler.customPrefix = /kick|avadachedavra|sparisci|puffo/i
handler.command = new RegExp
handler.admin = true

export default handler