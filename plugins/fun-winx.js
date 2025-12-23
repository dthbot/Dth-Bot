import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn }) => {
    let user = m.sender
    let username = `@${user.split('@')[0]}`

    let winx = pickRandom([
        { name: 'Bloom', power: 'Fuoco del Drago', description: 'Determinata, coraggiosa e sempre pronta a difendere i suoi amici!', image: 'winx_bloom.png' },
        { name: 'Stella', power: 'Luce del Sole', description: 'Solare, creativa e sempre alla moda! Sei la luce del gruppo!', image: 'winx_stella.png' },
        { name: 'Flora', power: 'Natura', description: 'Dolce, gentile e con un cuore grande. Ami la natura e la vita!', image: 'winx_flora.png' },
        { name: 'Tecna', power: 'Tecnologia', description: 'Intelligente, logica e sempre alla ricerca di soluzioni innovative!' , image: 'winx_tecna.png' },
        { name: 'Musa', power: 'Musica', description: 'Creativa e passionale, trovi sempre un modo per esprimere le tue emozioni!', image: 'winx_musa.png' },
        { name: 'Aisha', power: 'Onde e Acqua', description: 'Energica, avventurosa e sempre pronta a nuove sfide!', image: 'winx_aisha.png' }
    ])

    const imagePath = path.join(__dirname, 'icone', winx.image)

    let message = `🧚‍♀️ ${username}, la Winx che ti rappresenta è *${winx.name}*! 🧚‍♀️\n\n✨ *Potere*: ${winx.power}\n💖 *Descrizione*: ${winx.description}`

    let winxImage = { 
        key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'WinxTest' },
        message: { 
            locationMessage: { 
                name: 'Scopri la tua Winx!',
                jpegThumbnail: fs.readFileSync(imagePath)
            }
        }, 
        participant: '0@s.whatsapp.net'
    }

    conn.reply(m.chat, message, winxImage, { mentions: [user] })
}

handler.help = ['winx']
handler.tags = ['fun']
handler.command = /^winx$/i

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}