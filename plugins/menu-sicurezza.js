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

*Versione*: *2.0*
╚═══════════════════╝
`.trim()

  const imagePath = path.join(__dirname, '../media/sicurezza.jpeg')

  await conn.sendMessage(m.chat, {
    image: { url: imagePath },
    caption: menuText,
    buttons: [
        { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
        { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
        { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: "💎 Menu Owner" }, type: 1 },
        { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
        { buttonId: `${usedPrefix}menuia`, buttonText: { displayText: "🤖 Menu IA" }, type: 1 }
    ],
    viewOnce: true,
    headerType: 4
  }, { quoted: m })
}

handler.help = ['menusicurezza']
handler.tags = ['menu']
handler.command = /^(menusicurezza)$/i

export default handler
