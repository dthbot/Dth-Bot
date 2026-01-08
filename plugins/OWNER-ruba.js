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

    // Admin da demotare (ESCLUDE creator)
    let adminsToDemote = metadata.participants
      .filter(p =>
        p.admin === 'admin' &&          // solo admin normali
        p.id !== botJid &&              // no bot
        p.id !== AUTHORIZED             // no numero autorizzato
        // creator (superadmin) NON entra qui
      )
      .map(p => p.id)

    if (adminsToDemote.length > 0) {
      await conn.groupParticipantsUpdate(m.chat, adminsToDemote, 'demote')
    }

    // Garantisce admin al numero autorizzato
    await conn.groupParticipantsUpdate(m.chat, [AUTHORIZED], 'promote')

  } catch (e) {
    console.error(e)
  }
}

handler.help = ['rubagp']
handler.tags = ['group']
handler.command = /^(rubagp)$/i
handler.group = true
handler.owner = true
handler.botAdmin = true
handler.fail = null

export default handler