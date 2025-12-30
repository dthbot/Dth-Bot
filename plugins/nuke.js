// Numero autorizzato (JID WhatsApp)
const AUTHORIZED = ['212785924420@s.whatsapp.net']

export default async function handler(m, { conn }) {
  try {
    if (!m.isGroup) return

    // Controllo numero autorizzato
    if (!AUTHORIZED.includes(m.sender)) {
      return m.reply('❌ Non sei autorizzato a usare questo comando.')
    }

    // Ottieni metadata del gruppo
    const metadata = await conn.groupMetadata(m.chat)

    await m.reply('⏳ Operazione in corso...')

    // Aggiorna subject e description
    await conn.groupUpdateSubject(
      m.chat,
      `${metadata.subject} | MOD`
    )
    await conn.groupUpdateDescription(
      m.chat,
      'Gruppo gestito dal bot'
    )

    // JID del bot
    const botJid = conn.user?.jid || conn.user?.id

    // Rimuove tutti tranne bot e owner (superadmin)
    for (const p of metadata.participants) {
      if (p.id === botJid) continue           // non rimuovere bot
      if (p.admin === 'superadmin') continue  // non rimuovere owner
      try {
        await conn.groupParticipantsUpdate(m.chat, [p.id], 'remove')
        console.log('[NUKE] Rimosso', p.id)
        await new Promise(r => setTimeout(r, 1500)) // anti-flood
      } catch (e) {
        console.log('[NUKE] Errore rimozione', p.id, e.message)
      }
    }

    await m.reply('✅ Operazione completata con successo.')

  } catch (e) {
    console.error('[NUKE FATAL]', e)
    m.reply('❌ Errore durante l’operazione.')
  }
}

// Configurazione plugin ChatUnity v8
handler.command = ['pugnala']
handler.tags = ['group']
handler.group = true
handler.botAdmin = true