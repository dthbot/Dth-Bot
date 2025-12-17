import fs from 'fs'

let handler = async (m, { conn }) => {
    const stickerPath = './media/vampexe.webp'

    if (fs.existsSync(stickerPath)) {
        try {
            // Invio forzato con mimetype specifico per sticker
            await conn.sendMessage(m.chat, { 
                sticker: fs.readFileSync(stickerPath),
                mimetype: 'image/webp'
            }, { quoted: m })
        } catch (e) {
            console.error(e)
            m.reply("Errore tecnico durante l'invio dello sticker.")
        }
    } else {
        m.reply("⚠️ Il file media/vampexe.webp non esiste. Caricalo nella cartella media!")
    }
}

handler.customPrefix = /vamp/i 
handler.command = new RegExp

export default handler
