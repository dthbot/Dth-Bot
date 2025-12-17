import fs from 'fs'

let handler = async (m, { conn }) => {
    const stickerPath = './media/vampexe.webp'

    if (fs.existsSync(stickerPath)) {
        // Leggiamo il file
        let stiker = fs.readFileSync(stickerPath)
        
        // Inviamo come sticker usando il metodo corretto
        await conn.sendMessage(m.chat, { 
            sticker: stiker 
        }, { quoted: m })

    } else {
        // Se non lo trova, ti avvisa nel gruppo o in chat
        m.reply("⚠️ Errore: File 'media/vampexe.webp' non trovato. Controlla che il nome sia corretto!")
    }
}

handler.customPrefix = /vamp/i 
handler.command = new RegExp

export default handler
