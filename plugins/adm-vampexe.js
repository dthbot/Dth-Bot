// Plugin fatto da Axtral_WiZaRd 

import fs from 'fs'

let handler = message => message

handler.all = async function (message) {
    // 👇 conn È this
    const conn = this

    if (!message.isGroup) return
    if (!message.text) return

    let chatData = global.db.data.chats[message.chat]
    if (!chatData || !chatData.cinema) return

    if (/vampexe/i.test(message.text)) {
        const stickerData = fs.readFileSync('./media/vampexe.webp')

        await conn.sendMessage(
            message.chat,
            { sticker: stickerData },
            { quoted: message }
        )
    }
}

export default handler
