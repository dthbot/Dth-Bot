import fetch from 'node-fetch'

// thumbnail piccola per i moderatori
const getThumb = async () => 
  Buffer.from(await (await fetch('https://media.tenor.com/WyqUoMKzV6kAAAAC/shocked-face-black.gif')).arrayBuffer())

let handler = async (m, { conn, text, participants }) => {

  // filtriamo solo utenti premium (moderatori)
  const mods = participants
    .filter(p => global.db.data.users[p.id]?.premium)
    .map(p => p.id)

  if (!mods.length) return m.reply('❌ Non ci sono moderatori attivi in questo gruppo.')

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
handler.premium = true 
export default handler