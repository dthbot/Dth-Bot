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
│ 💖 *Moglie di Death* 💖
╰───────────────╯

🌹 *Lei non è solo una ragazza.*
È un pensiero fisso,
un battito che non sbaglia mai.

🖤 Forte, vera, unica  
🔥 Bellezza che non si spegne  
👑 Regina senza corona  

💍 *La mia scelta.*
🩸 La mia vamp.

_Chi la ama resta._
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

handler.command = ['mogliedideath']
handler.tags = ['fun']
handler.help = ['mogliedideath']

export default handler
