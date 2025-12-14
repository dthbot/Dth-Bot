// Plugin fatto da Axtral_WiZaRd
import fs from 'fs'

let handler = async (m, { conn }) => {
  try {
    let audioPath = './audio/videoplayback.m4a'

    await conn.sendMessage(m.chat, {
      audio: fs.readFileSync(audioPath),
      mimetype: 'audio/mp4', // ✅ CORRETTO per .m4a
      ptt: false
    })
  } catch (err) {
    console.error('Errore nel comando:', err)
    await m.reply('⚠️ Errore')
  }
}

handler.command = /^(tuedio)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
