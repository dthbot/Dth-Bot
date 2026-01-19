import axios from 'axios'

let handler = async (m, { conn }) => {
  try {
    // Utente target: menzionato, citato o autore
    let user = m.mentionedJid?.[0] || m.quoted?.sender || m.sender

    // Nome utente
    let name = await conn.getName(user).catch(() => 'User')

    // Percentuale random 1–100
    let percent = Math.floor(Math.random() * 100) + 1

    // Foto profilo
    let avatar
    try {
      avatar = await conn.profilePictureUrl(user, 'image')
    } catch {
      avatar = 'https://telegra.ph/file/6880771a42bad09dd6087.jpg'
    }

    // URL API
    let api = `https://api.siputzx.my.id/api/canvas/gay?nama=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatar)}&num=${percent}`

    // Richiesta immagine
    let res = await axios.get(api, { responseType: 'arraybuffer' })
    let buffer = Buffer.from(res.data)

    // Invia messaggio
    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: `🌈 @${user.split('@')[0]} è gay al *${percent}%* 🏳️‍🌈`,
        mentions: [user]
      },
      { quoted: m }
    )

  } catch (err) {
    console.error(err)
    m.reply('❌ Errore durante la generazione dell’immagine.')
  }
}

handler.help = ['gay @user']
handler.tags = ['fun']
handler.command = /^gay$/i

export default handler