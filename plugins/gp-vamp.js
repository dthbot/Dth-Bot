import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  name: 'mogliedideath',
  command: ['mogliedideath'],
  category: 'fun',
  desc: 'Descrizione della moglie di Death',

  async run({ conn, m }) {
    const fotoPath = path.join(__dirname, '../media/vamp.jpeg')

    const descrizione = `
╭───────────────╮
│ 💖 *Moglie di Death* 💖
╰───────────────╯

🌹 *Lei non è solo una ragazza.*
È un pensiero fisso,
un battito che non sbaglia mai.

✨ Ha uno sguardo che calma il caos  
🖤 Un sorriso che vale più di mille promesse  
🔥 Un’anima forte, bella e vera  

💍 *La mia scelta ogni giorno.*
👑 La mia regina.
🩸 La mia vamp.

_Chi la ama non la dimentica._
_Chi la guarda, resta._
    `.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: fs.readFileSync(fotoPath),
        caption: descrizione
      },
      { quoted: m }
    )
  }
}
