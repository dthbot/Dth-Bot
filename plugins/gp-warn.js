let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {
  let war = 2 // <-- numero di warning prima del ban

  let who
  if (m.isGroup) {
    who = m.mentionedJid?.[0] || m.quoted?.sender
  } else {
    who = m.chat
  }

  if (!who) return m.reply("𝐃𝐞𝐯𝐢 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚𝐫𝐞 𝐮𝐧 𝐮𝐭𝐞𝐧𝐭𝐞 𝐨 𝐫𝐢𝐬𝐩𝐨𝐧𝐝𝐞𝐫𝐞 𝐚 𝐮𝐧 𝐬𝐮𝐨 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐟𝐫𝐨𝐜𝐢𝐨")

  // 🔒 BLOCCA AVVERTIMENTI AL BOT
  if (who === conn.user.jid) {
    return m.reply("𝐍𝐨𝐧 𝐩𝐮𝐨𝐢 𝐰𝐚𝐫𝐧𝐚𝐫𝐞 𝐢𝐥 𝐛𝐨𝐭 𝐝𝐨𝐰𝐧")
  }

  if (!(who in global.db.data.users)) {
    return m.reply("𝙉𝙤𝙣 𝙝𝙤 𝙩𝙧𝙤𝙫𝙖𝙩𝙤 𝙞𝙡 𝙘𝙖𝙯𝙯𝙤 𝙙𝙞 𝙪𝙩𝙚𝙣𝙩𝙚")
  }

  let user = global.db.data.users[who]
  let warn = user.warn || 0
  let nomeDelBot = global.db.data.nomedelbot || `𝔻𝕋ℍ-𝔹𝕆𝕋`

  const messageOptions = {
    contextInfo: {
      mentionedJid: [who],
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '',
        serverMessageId: '',
        newsletterName: `${nomeDelBot}`
      }
    }
  }

  if (warn < war) {
    user.warn += 1
    await conn.sendMessage(m.chat, {
      text: `⚠️ 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎 ${user.warn}/𝟑 (𝟑 𝐰𝐚𝐫𝐧=𝐛𝐚𝐧)`,
      ...messageOptions
    })
  } else if (warn >= war) {
    user.warn = 0
    await conn.sendMessage(m.chat, {
      text: `⛔ 𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐃𝐎𝐏𝐎 3 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐈 (𝐀𝐯𝐞𝐯𝐚 𝐫𝐨𝐭𝐭𝐨 𝐢𝐥 𝐜𝐚𝐳𝐳𝐨)`,
      ...messageOptions
    })
    await sleep(1000)
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
  }
}

handler.help = ['warn @user']
handler.tags = ['group']
handler.command = /^(ammonisci|avvertimento|warn|warning)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

// Funzione di attesa
const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))
