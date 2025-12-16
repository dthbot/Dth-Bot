import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn }) => {
  const fotoPath = path.join(__dirname, '../media/vamp.jpeg')

  if (!fs.existsSync(fotoPath)) {
    return m.reply('❌ Foto non trovata: media/vamp.jpeg')
  }

  const text = `
╭───────────────╮
│ 🖤 𝐌𝐨𝐠𝐥𝐢𝐞 𝐝𝐢 𝕯𝖊ⱥ𝖉𝖑𝐲 🖤
╰───────────────╯

𝐍𝐨𝐧 è 𝐬𝐨𝐥𝐨 𝐮𝐧𝐚 𝐝𝐨𝐧𝐧𝐚.
È 𝐢𝐥 𝐦𝐢𝐨 𝐩𝐞𝐧𝐬𝐢𝐞𝐫𝐨 𝐜𝐨𝐬𝐭𝐚𝐧𝐭𝐞.
𝐅𝐚𝐬𝐜𝐢𝐧𝐨 𝐜𝐡𝐞 𝐥𝐚𝐬𝐜𝐢𝐚 𝐢𝐥 𝐬𝐞𝐠𝐧𝐨.
𝐒𝐨𝐯𝐫𝐚𝐧𝐚 𝐚𝐧𝐜𝐡𝐞 𝐬𝐞𝐧𝐳𝐚 𝐭𝐫𝐨𝐧𝐨.

-𝒄𝒐𝒏 𝒍𝒆𝒊, 𝒕𝒖𝒕𝒕𝒐 𝒉𝒂 𝒔𝒆𝒏𝒔𝒐
  `.trim()

  await conn.sendMessage(
    m.chat,
    {
      image: fs.readFileSync(fotoPath),
      caption: text
    },
    { quoted: m }
  )
}

handler.command = ['mogliedideadly']
handler.tags = ['fun']
handler.help = ['mogliedideadly']

export default handler
