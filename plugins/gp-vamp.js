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
│ 💖 *Moglie di 𝕯𝖊𝖉𝖑𝐲* 💖
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

handler.command = ['mogliedidedly']
handler.tags = ['fun']
handler.help = ['mogliedidedly']

export default handler
