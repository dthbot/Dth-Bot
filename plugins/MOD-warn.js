import fetch from 'node-fetch'

const time = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

// thumbnail (fetch FIX)
const getThumb = async () =>
  Buffer.from(await (await fetch('https://qu.ax/fmHdc.png')).arrayBuffer())

let handler = async (m, { conn, text, command, isOwner }) => {
  // ================= UTENTE =================
  let who
  if (m.isGroup)
    who = m.mentionedJid?.[0] ?? m.quoted?.sender ?? null
  else who = m.chat

  if (!who) return

  // Controllo permessi: owner o premium
  const userDB = global.db.data.users[m.sender] || {}
  if (!isOwner && !userDB.premium) {
    return m.reply('⛔ *Questo comando è riservato ai MOD / PREMIUM*')
  }

  if (!global.db.data.users[who]) {
    global.db.data.users[who] = { warn: 0 }
  }

  let user = global.db.data.users[who]

  const prova = {
    key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'Halo' },
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

  // ================= WARN MOD =================
  if (command === 'warnmod') {
    user.warn = 1
    await conn.reply(
      m.chat,
      `⚠️ @${who.split('@')[0]} è stato ammonito da un MOD / PREMIUM`,
      prova,
      { mentions: [who] }
    )
  }

  // ================= UNWARN MOD =================
  if (command === 'unwarnmod') {
    user.warn = 0
    await conn.reply(
      m.chat,
      `✅ @${who.split('@')[0]} non ha più ammonizioni`,
      prova,
      { mentions: [who] }
    )
  }
}

handler.help = ['warnmod', 'unwarnmod']
handler.command = ['warnmod', 'unwarnmod']
handler.group = true
handler.premium = false
handler.botAdmin = true

export default handler