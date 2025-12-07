import fs from "fs"
import { performance } from "perf_hooks"
import Jimp from "jimp"

let handler = async (m, { conn, usedPrefix }) => {
  const start = performance.now()

  // Messaggio iniziale richiesto
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
      image.resize(300, Jimp.AUTO).quality(70)
      thumbBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)
    }
  } catch (e) {
    console.error("Errore nel caricare la thumbnail:", e)
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
      footer: "📡 Ping & Stato del Bot",
      buttons: [
        { buttonId: `${usedPrefix}ping`, buttonText: { displayText: "⏳ 𝐑𝐢𝐟𝐚𝐢 𝐏𝐢𝐧𝐠" }, type: 1 },
        { buttonId: `${usedPrefix}ds`, buttonText: { displayText: "🗑️ 𝐃𝐬" }, type: 1 }
      ],
      headerType: 1,
      contextInfo: {
        externalAdReply: {
          title: "📡 Stato del Bot",
          body: "𝔻𝕋ℍ-𝔹𝕆𝕋",
          mediaType: 1,
          thumbnail: thumbBuffer ?? undefined,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: m }
  )
}

handler.help = ["ping", "status", "uptime"]
handler.tags = ["info"]
handler.command = /^(status|uptime|ping)$/i

export default handler
