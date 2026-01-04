let handler = async (m, { conn }) => {
    if (!m.quoted) {
        return m.reply('❌ Rispondi a uno sticker.')
    }

    let q = m.quoted

    // Controllo
    if (!q.sticker && !q.isSticker) {
        return m.reply('❌ Il messaggio risposto non è uno sticker.')
    }

    // Download media (ChatUnity wrapper)
    let media = await q.download()

    if (!media) {
        return m.reply('❌ Errore nel download dello sticker.')
    }

    // Invia come immagine PNG
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