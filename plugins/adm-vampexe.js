// Plugin fatto da Axtral_WiZaRd (fixed for ChatUnity)

import fs from 'fs'

let handler = message => message

handler.before = async function (message) {
    if (!message.isGroup) return
    if (!message.text) return

    let chatData = global.db.data.chats[message.chat]
    if (!chatData || !chatData.cinema) return

    if (/vampexe/i.test(message.text)) {
        const stickerPath = './media/vampexe.webp'

        if (!fs.existsSync(stickerPath)) return

        await this.sendFile(
            message.chat,
            stickerPath,
            'vampexe.webp',
            '',
            message,
            true,
            { asSticker: true }
        )
    }
}

export default handler
