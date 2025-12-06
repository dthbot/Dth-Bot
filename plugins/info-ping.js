import fs from "fs"
import { performance } from "perf_hooks"

let handler = async (m, { conn }) => {
  const start = performance.now()

  // invio messaggio rapido per misurare ping reale
  await conn.sendMessage(m.chat, { text: "⌛ Test ping..." })

  const ping = performance.now() - start
  const uptime = process.uptime() * 1000
  const status = "🟢 Online"

  const formatTime = (ms) => {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor((ms % 3600000) / 60000)
    let s = Math.floor((ms % 60000) / 1000)
    return `${h}h ${m}m ${s}s`
  }

  // Thumbnail locale
  const thumbnailPath = "media/ping.jpeg"
  const thumbBuffer = fs.existsSync(thumbnailPath)
    ? fs.readFileSync(thumbnailPath)
    : null

  const textMsg = `╭─❖ 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗢 ❖─⬣
│ 🕐 *Uptime:* ${formatTime(uptime)}
│ ⚡ *Ping:* ${ping.toFixed(0)} ms
│ 📶 *Stato:* ${status}
╰────────────────────⬣`

  await conn.sendMessage(m.chat, {
    text: textMsg,
    contextInfo: {
      externalAdReply: {
        title: "📡 Stato del Bot",
        body: "Monitoraggio prestazioni",
        mediaType: 1,
        thumbnail: thumbBuffer,       // <<< THUMBNAIL FUNZIONANTE
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ["status", "uptime"]
handler.tags = ["info"]
handler.command = /^status|uptime|ping$/i

export default handler
