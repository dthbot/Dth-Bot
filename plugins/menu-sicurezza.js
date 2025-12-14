import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn, usedPrefix }) => {

  const menuText = `
⚡𝑴𝑬𝑵𝑼 𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐈⚡
╔═══════════════════╗
.attiva (funzione)
.disattiva (funzione)

➥ Benvenuto
➥ AntiSpam
➥ AntiTrava
➥ AntiNuke
➥ AntiBestemmie
➥ SoloAdmin
➥ AntiBot
➥ AntiMedia
➥ AntiTikTok
➥ AntiLink
➥ AntiInsta

Versione: 1.0
╚═══════════════════╝
`.trim()

  const imagePath = path.join(__dirname, '../media/sicurezza.jpeg')

  await conn.sendMessage(m.chat, {
    image: fs.readFileSync(imagePath),
    caption: menuText
  }, { quoted: m })
}

handler.help = ['menusicurezza']
handler.tags = ['menu']
handler.command = /^(menusicurezza)$/i

export default handler
