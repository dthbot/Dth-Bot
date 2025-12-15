async function handler(m, { isBotAdmin, isOwner, text, conn }) {
  if (!isBotAdmin) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Devo essere admin per poter funzionare'
    }, { quoted: m })
  }

  const mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.quoted
  if (!mention) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Menziona la persona da rimuovere'
    }, { quoted: m })
  }

  const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

  if (mention === ownerBot) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Non puoi rimuovere il creatore del bot suka bastardo'
    }, { quoted: m })
  }

  if (mention === conn.user.jid) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Non puoi rimuovere il bot sei proprio un coglione'
    }, { quoted: m })
  }

  if (mention === m.sender) {
    return await conn.sendMessage(m.chat, {
      text: 'ⓘ Non puoi rimuovere te stesso, se vuoi ti kicka 𝕯𝖊ⱥ𝖉𝖑𝐲'
    }, { quoted: m })
  }

  const groupMetadata = conn.chats[m.chat]?.metadata
  const participants = groupMetadata?.participants || []
  const utente = participants.find(u => conn.decodeJid(u.id) === mention)

  const owner = utente?.admin === 'superadmin'
  const admin = utente?.admin === 'admin'

  if (owner) {
    return await conn.sendMessage(m.chat, {
      text: "ⓘ L'utente che hai provato a rimuovere 𝐞̀ il creatore del gruppo mannaggia"
    }, { quoted: m })
  }

  if (admin) {
    return await conn.sendMessage(m.chat, {
      text: "ⓘ L'utente che hai provato a rimuovere è admin porcoddio"
    }, { quoted: m })
  }

  const reason = text ? `\n\n𝐌𝐨𝐭𝐢𝐯𝐨: ${text.replace(/@\d+/g, '').trim()}` : ''
  
  await conn.sendMessage(m.chat, {
    text: `@${mention.split`@`[0]} è 𝐬𝐭𝐚𝐭𝐨 𝐚𝐛𝐮𝐬𝐚𝐭𝐨 𝐦𝐚𝐥𝐞 𝐝𝐚 @${m.sender.split`@`[0]}${reason}`,
    mentions: [mention, m.sender]
  }, { quoted: m })

  await conn.groupParticipantsUpdate(m.chat, [mention], 'remove')
}

handler.customPrefix = /kick|avadachedavra|sparisci|puffo/i
handler.command = new RegExp
handler.admin = true

export default handler
