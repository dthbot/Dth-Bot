let handler = async (m, { conn }) => {
    if (!m.quoted) {
        return m.reply('❌ Rispondi a uno sticker.')
    }

    let q = m.quoted

    // Controllo corretto 
    if (!q.message || !q.message.stickerMessage) {
        return m.reply('❌ Il messaggio risposto non è uno sticker.')
    }

    // Scarica lo sticker
    let media = await q.download()

    // Invia come immagine
    await conn.sendMessage(
        m.chat,
        {
            image: media,
            caption: '✅ Sticker convertito in immagine'
        },
        { quoted: m }
    )
}

handler.command = ['stickerpng']
handler.tags = ['tools']
handler.help = ['stickerpng']

export default handler