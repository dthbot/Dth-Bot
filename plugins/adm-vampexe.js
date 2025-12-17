import fs from 'fs'

let handler = async function (m) {
    const stickerPath = './media/vampexe.webp'
    if (!fs.existsSync(stickerPath)) return

    await this.sendFile(
        m.chat,
        stickerPath,
        'vampexe.webp',
        '',
        m,
        true,
        { asSticker: true }
    )
}

// 👇 QUESTO È IL SEGRETO
handler.customPrefix = /vampexe/i
handler.command = new RegExp

export default handler
