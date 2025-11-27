)

```js
let handler = async (m, { conn }) => {
  const uptime = process.uptime() * 1000
  const time = clockString(uptime)

  const start = Date.now()
  await conn.sendMessage(m.chat, { text: '📡 Calcolo in corso...' }, { quoted: m })
  const end = Date.now()

  const ping = end - start
  const status = '🟢 Attivo'

  const msg = `╭─❖ 𝙎𝙏𝘼𝙏𝙐𝙎 ❖─⬣
│ 🕐 *Uptime:* time
│ 🚀 *Velocità:*{ping} ms
│ 📶 *Stato:* status
╰───────────────⬣`

  await conn.sendMessage(m.chat,  text: msg ,  quoted: m )


handler.help = ['status', 'uptime']
handler.tags = ['info']
handler.command = /^status|uptime/i

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return `hh{m}m ${s}s`
}
```
