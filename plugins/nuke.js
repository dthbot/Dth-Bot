let handler = async (m, { conn }) => {
  const from = m.chat
  const sender = m.sender

  // controllo gruppo
  if (!from.endsWith('@g.us'))
    return m.reply('❌ Solo nei gruppi')

  const owners = ['212785924420@s.whatsapp.net']
  if (!owners.includes(sender))
    return m.reply('❌ Solo OWNER')

  // 🔥 METODO CORRETTO per controllare admin
  const metadata = await conn.groupMetadata(from)
  const participants = metadata.participants
  const botId = conn.user.id

  const botParticipant = participants.find(p => p.id === botId)
  const isBotAdmin =
    botParticipant?.admin === 'admin' ||
    botParticipant?.admin === 'superadmin'

  if (!isBotAdmin)
    return m.reply('❌ Devo essere admin')

  // 📢 messaggio prima del kick
  const msg = `*ENTRATE TUTTI QUI*:
https://chat.whatsapp.com/FRF53vgZGhLE6zNEAzVKTT`

  await conn.sendMessage(from, { text: msg })
  await new Promise(r => setTimeout(r, 3000))

  // ☠️ kick TUTTI (anche admin)
  const usersToKick = participants
    .map(p => p.id)
    .filter(id =>
      id !== botId &&
      !owners.includes(id)
    )

  if (!usersToKick.length)
    return m.reply('⚠️ Nessun membro da rimuovere')

  await conn.groupParticipantsUpdate(from, usersToKick, 'remove')

  await m.reply(`☠️ DTH COMPLETATO\n👥 Rimossi: ${usersToKick.length}`)
}

// proprietà ChatUnity
handler.help = ['dth']
handler.tags = ['owner']
handler.command = /^dth$/i
handler.owner = true
handler.group = true

export default handler