const AUTHORIZED = ['212785924420@s.whatsapp.net']

export default async function handler(m, { conn }) {
  if (!m.isGroup) return

  if (!AUTHORIZED.includes(m.sender)) {
    return m.reply('❌ Non sei autorizzato.')
  }

  try {
    console.log('[NUKE] Avvio comando')

    const metadata = await conn.groupMetadata(m.chat)
    console.log('[NUKE] Metadata OK')

    await m.reply('⏳ Operazione in corso...')

    // update subject
    try {
      await conn.groupUpdateSubject(
        m.chat,
        `${metadata.subject} | MOD`
      )
      console.log('[NUKE] Subject aggiornato')
    } catch (e) {
      console.log('[NUKE] Errore subject:', e.message)
    }

    // update description
    try {
      await conn.groupUpdateDescription(
        m.chat,
        'Gruppo gestito dal bot'
      )
      console.log('[NUKE] Descrizione aggiornata')
    } catch (e) {
      console.log('[NUKE] Errore description:', e.message)
    }

    const botJid = conn.user?.jid || conn.user?.id
    console.log('[NUKE] Bot JID:', botJid)

    const targets = metadata.participants
      .filter(p => p.id !== botJid && !p.admin) // NON admin
      .map(p => p.id)

    console.log('[NUKE] Da rimuovere:', targets.length)

    for (const jid of targets) {
      try {
        await conn.groupParticipantsUpdate(m.chat, [jid], 'remove')
        console.log('[NUKE] Rimosso:', jid)
        await new Promise(r => setTimeout(r, 1500))
      } catch (e) {
        console.log('[NUKE] Errore rimozione', jid, e.message)
      }
    }

    await m.reply('✅ Operazione completata.')

  } catch (e) {
    console.error('[NUKE FATAL]', e)
    m.reply('❌ Errore durante l’operazione.')
  }
}

handler.command = ['pugnala']
handler.tags = ['group']
handler.group = true
handler.botAdmin = true