import fs from "fs"
import { performance } from "perf_hooks"
import Jimp from "jimp"

let handler = async (m, { conn, usedPrefix }) => {
  const start = performance.now()

  await conn.sendMessage(m.chat, { text: "*Sto facendo il Test del Ping...⏳*" })

  const ping = performance.now() - start
  const uptime = process.uptime() * 1000
  const status = "🟢 Online"

  const formatTime = (ms) => {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor((ms % 3600000) / 60000)
    let s = Math.floor((ms % 60000) / 1000)
    return `${h}h ${m}m ${s}s`
  }

  const thumbnailPath = "media/ping.jpeg"
  let thumbBuffer = null

  try {
    if (fs.existsSync(thumbnailPath)) {
      let image = await Jimp.read(thumbnailPath)
      image.resize(400, Jimp.AUTO).quality(90)
      thumbBuffer = await image.getBufferAsync(Jimp.MIME_PNG) // <-- PNG FUNZIONA SEMPRE
    }
  } catch (e) {
    console.error("Errore caricando la thumbnail:", e)
  }

  const textMsg = `╭─❖ 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗢 ❖─⬣
│ 🕐 *Uptime:* ${formatTime(uptime)}
│ ⚡ *Ping:* ${ping.toFixed(0)} ms
│ 📶 *Stato:* ${status}
╰────────────────────⬣`

  await conn.sendMessage(
    m.chat,
    {
      text: textMsg,
      footer: "📡 Ping di 𝔻𝕋ℍ-𝔹𝕆𝕋",
      buttons: [
        { buttonId: `${usedPrefix}ping`, buttonText: { displayText: "⏳ 𝐑𝐢𝐟𝐚𝐢 𝐏𝐢𝐧𝐠" }, type: 1 },
        { buttonId: `${usedPrefix}ds`, buttonText: { displayText: "🗑️ 𝐃𝐬" }, type: 1 }
      ],
      headerType: 1,

      contextInfo: {
        externalAdReply: {
          title: "📡 Stato del Bot",
          body: "DTH-BOT",
          mediaType: 1,
          thumbnail: thumbBuffer, // FUNZIONA
          sourceUrl: "https://google.com", // OBBLIGATORIO, anche finto
          renderLargerThumbnail: true,
        }
      }
    },
    { quoted: m }
  )
}

handler.help = ["ping", "status", "uptime"]
handler.tags = ["info"]
handler.command = /^(ping|status|uptime)$/i

export default handler
