import fs from 'fs'

let handler = async function (m) {
    const buffer = fs.readFileSync('./media/vampexe.webp')

    await this.sendMessage(
        m.chat,
        { sticker: buffer },
        { quoted: m }
    )
}

handler.customPrefix = /vampexe/i
handler.command = new RegExp

export default handler
