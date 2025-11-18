let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
  if (!m.isGroup || !isBotAdmin || !isAdmin) return
  try {
    const pending = await conn.groupRequestParticipantsList(m.chat)
    if (!pending.length) return m.reply("𝐍𝐞𝐬𝐬𝐮𝐧 𝐧𝐞𝐠𝐫𝐨 𝐡𝐚 𝐟𝐚𝐭𝐭𝐨 𝐫𝐢𝐜𝐡𝐢𝐞𝐬𝐭𝐚.")
    let count = 0
    for (let p of pending) {
      try {
        await conn.groupRequestParticipantsUpdate(m.chat, [p.jid], 'approve')
        count++
      } catch {}
    }
    m.reply(`✅ Accettate ${count} richieste.`)
  } catch {
    m.reply('Errore.')
  }
}
handler.command = ['accettarichieste']
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler
