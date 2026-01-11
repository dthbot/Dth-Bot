import fetch from 'node-fetch'

const getThumb = async () => 
  Buffer.from(await (await fetch('https://media.tenor.com/WyqUoMKzV6kAAAAC/shocked-face-black.gif')).arrayBuffer())

let handler = async (m, { conn, text, participants, isAdmin }) => {
  // 🔐 Solo admin possono usare il comando
  if (!isAdmin) return m.reply('❌ Solo admin possono usare questo comando!')

  // Filtra i moderatori dal database globale
  const mods = participants
    .filter(p => {
      const userDB = global.db.data.users[p.id] || {}
      return userDB.mod || userDB.premium || false
    })
    .map(p => p.id)

  if (!mods.length) {
    return m.reply('❌ Non ci sono moderatori attivi in questo gruppo.')
  }

  const mentionsText = text ? `${text}\n\n` : ''

  const styledMods = mods
    .map(u => `👑 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗢𝗥𝗘 » @${u.split('@')[0]}`)
    .join('\n')

  const message = `
✨━━━━━━━━━━━━━━━━✨
📢 𝗠𝗢𝗗𝗘𝗥𝗔𝗧𝗢𝗥𝗜 𝗔𝗧𝗧𝗜𝗩𝗜 📢

${mentionsText}${styledMods}

✨━━━━━━━━━━━━━━━━✨
⚡ Grazie per il vostro impegno nel mantenere il gruppo sicuro! ⚡
`

  await conn.sendMessage(
    m.chat,
    {
      image: await getThumb(),
      caption: message,
      mentions: mods
    },
    { quoted: m }
  )
}

handler.help = ['moderatori [messaggio]']
handler.command = ['moderatori']
handler.group = true
handler.admin = true 
export default handler