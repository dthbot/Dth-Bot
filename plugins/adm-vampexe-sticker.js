import fs from 'fs'

let handler = async (m, { conn }) => {
    const stickerPath = './media/vampexe.webp'

    if (!fs.existsSync(stickerPath)) {
        return m.reply("⚠️ Il file media/vampexe.webp non esiste!")
    }

    // Usiamo sendFile che gestisce automaticamente la conversione e i metadati
    await conn.sendFile(m.chat, stickerPath, 'sticker.webp', '', m, { asSticker: true })
}

handler.customPrefix = /vamp/i 
handler.command = new RegExp

export default handler
