import fs from 'fs'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    if (!m.quoted) {
        return conn.sendMessage(m.chat, { text: '❌ Rispondi a uno sticker.' }, { quoted: m })
    }

    let quoted = m.quoted
    let mime = quoted.mimetype || ''

    if (!/webp/.test(mime)) {
        return conn.sendMessage(m.chat, { text: '❌ Il messaggio risposto non è uno sticker.' }, { quoted: m })
    }

    // Scarica lo sticker
    let stream = await downloadContentFromMessage(quoted.message.stickerMessage, 'sticker')
    let buffer = Buffer.from([])

    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }

    // Invia come immagine PNG
    await conn.sendMessage(
        m.chat,
        {
            image: buffer,
            caption: '✅ Sticker convertito in immagine'
        },
        { quoted: m }
    )
}

handler.command = ['stickerpng']
handler.help = ['stickerpng']
handler.tags = ['tools']

export default handler