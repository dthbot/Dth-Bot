const time = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// thumbnail (fix fetch)
const getThumb = async () =>
  Buffer.from(
    await (await fetch('https://qu.ax/fmHdc.png')).arrayBuffer()
  )

let handler = async (m, { conn, text, args, command }) => {

  // ================= WARN =================
  if (command === 'warn' || command === 'ammonisci') {
    let maxWarn = 3
    let who

    if (m.isGroup)
      who = m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : null
    else who = m.chat

    if (!who) return

    if (!global.db.data.users[who]) {
      global.db.data.users[who] = { warn: 0 }
    }

    let user = global.db.data.users[who]

    const prova = {
      key: {
        participants: '0@s.whatsapp.net',
        fromMe: false,
        id: 'Halo'
      },
      message: {
        locationMessage: {
          name: '𝐀𝐭𝐭𝐞𝐧𝐳𝐢𝐨𝐧𝐞',
          jpegThumbnail: await getThumb(),
          vcard: `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Ponsel
END:VCARD`
        }
      },
      participant: '0@s.whatsapp.net'
    }

    const reason = text ? `❓ » ${text.replace(m.sender, '')}` : ''

    if (user.warn < maxWarn - 1) {
      user.warn++
      await conn.reply(
        m.chat,
        `👤 » @${who.split('@')[0]}\n⚠️ » *${user.warn} / ${maxWarn}*\n${reason}`,
        prova,
        { mentions: [who] }
      )
    } else {
      user.warn = 0
      await conn.reply(
        m.chat,
        '𝐔𝐭𝐞𝐧𝐭𝐞 𝐫𝐢𝐦𝐨𝐬𝐬𝐨 𝐝𝐨𝐩𝐨 𝟑 𝐚𝐯𝐯𝐞𝐫𝐭𝐢𝐦𝐞𝐧𝐭𝐢',
        prova
      )
      await time(1000)
      await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
    }
  }

  // ================= UNWARN =================
  if (command === 'unwarn' || command === 'delwarn') {
    let who

    if (m.isGroup)
      who = m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : null
    else who = m.chat

    if (!who) return

    if (!global.db.data.users[who]) {
      global.db.data.users[who] = { warn: 0 }
    }

    let user = global.db.data.users[who]

    if (user.warn > 0) {
      user.warn--

      const prova = {
        key: {
          participants: '0@s.whatsapp.net',
          fromMe: false,
          id: 'Halo'
        },
        message: {
          locationMessage: {
            name: '𝐀𝐭𝐭𝐞𝐧𝐳𝐢𝐨𝐧𝐞',
            jpegThumbnail: await getThumb(),
            vcard: `BEGIN:VCARD
VERSION:3.0
N:Sy;Bot;;;
FN:y
item1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}
item1.X-ABLabel:Ponsel
END:VCARD`
          }
        },
        participant: '0@s.whatsapp.net'
      }

      await conn.reply(
        m.chat,
        `👤 » @${who.split('@')[0]}\n⚠️ » *${user.warn} / 3*`,
        prova,
        { mentions: [who] }
      )
    } else {
      m.reply('𝐋’𝐮𝐭𝐞𝐧𝐭𝐞 𝐦𝐞𝐧𝐳𝐢𝐨𝐧𝐚𝐭𝐨 𝐧𝐨𝐧 𝐡𝐚 𝐚𝐯𝐯𝐞𝐫𝐭𝐢𝐦𝐞𝐧𝐭𝐢.')
    }
  }
}

handler.help = ['warn', 'ammonisci', 'unwarn', 'delwarn']
handler.command = ['warn', 'ammonisci', 'unwarn', 'delwarn']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler