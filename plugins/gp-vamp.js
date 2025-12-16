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
│ 🖤 moglie di 𝕯𝖊ⱥ𝖉𝖑𝐲 🖤
╰───────────────╯

*Non è solo una donna.
È il mio pensiero costante.
Fascino che lascia il segno.
Sovrana anche senza trono.*

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
