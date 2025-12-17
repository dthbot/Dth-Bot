import fs from 'fs'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const imagePath = './media/vamp1.jpeg'
    const caption = "𝐕𝐚𝐦𝐩𝐞xe è 𝐥𝐚 𝐦𝐨𝐠𝐥𝐢𝐞 𝐝𝐢 𝕯𝖊ⱥ𝖉𝖑𝐲, 𝐭𝐮𝐭𝐭𝐢 𝐬𝐚𝐧𝐧𝐨 𝐜𝐡𝐞 𝐧𝐨𝐧 𝐥𝐚 𝐝𝐞𝐯𝐨𝐧𝐨 𝐭𝐨𝐜𝐜𝐚𝐫𝐞 𝐬𝐞𝐧𝐧ò 𝐬𝐨𝐧𝐨 𝐠𝐮𝐚𝐢 🖤"

    if (fs.existsSync(imagePath)) {
        await conn.sendMessage(m.chat, {
            image: fs.readFileSync(imagePath),
            caption: caption,
            viewOnce: true
        }, { quoted: m })
    } else {
        m.reply("Errore: La foto non è stata trovata nella cartella media/vamp1.jpeg")
    }
}

// Qui impostiamo il comando che attiva il bot
handler.customPrefix = /vampexe/i
handler.command = new RegExp
handler.tags = ['premium']

export default handler
