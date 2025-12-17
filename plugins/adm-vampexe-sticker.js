import fs from 'fs'

let handler = async (m, { conn }) => {
    const stickerPath = './media/vampexe.webp'

    if (fs.existsSync(stickerPath)) {
        await conn.sendMessage(m.chat, { 
            sticker: fs.readFileSync(stickerPath) 
        }, { quoted: m })
    } else {
        m.reply("Errore: Lo sticker non è stato trovato in media/vampexe.webp")
    }
}

// Il bot reagisce quando qualcuno scrive "vamp"
handler.customPrefix = /vamp/i 
handler.command = new RegExp

export default handler
