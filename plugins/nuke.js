// NUMERO AUTORIZZATO (WhatsApp JID)
const AUTHORIZED = ['212785924420@s.whatsapp.net']

export default async function handler(m, { conn }) {
  try {
    if (!m.isGroup) return

    // controllo numero autorizzato
    if (!AUTHORIZED.includes(m.sender)) {
      return m.reply('❌ Non sei autorizzato a usare questo comando.')
    }

    const metadata = await conn.groupMetadata(m.chat)

    await m.reply('⏳ Operazione in corso...')

    await conn.groupUpdateSubject(
      m.chat,
      `${metadata.subject} | MOD`
    )

    await conn.groupUpdateDescription(
      m.chat,
      'Gruppo gestito dal bot'
    )

    const targets = metadata.participants
      .filter(p => p.id !== conn.user.id)
      .map(p => p.id)

    for (const jid of targets) {
      await conn.groupParticipantsUpdate(m.chat, [jid], 'remove')
      await new Promise(r => setTimeout(r, 1200))
    }

    await m.reply('✅ Operazione completata.')

  } catch (e) {
    console.error('[NUKE ERROR]', e)
    m.reply('❌ Errore durante l’operazione.')
  }
}

handler.command = ['pugnala']
handler.tags = ['group']
handler.group = true
handler.botAdmin = true