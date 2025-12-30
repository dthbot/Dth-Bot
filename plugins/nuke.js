export default {
  name: 'pugnala',
  command: ['pugnala'],
  tags: ['group'],
  desc: 'Gestione avanzata gruppo (solo owner)',
  group: true,
  botAdmin: true,

  async run(m, { sock }) {
    try {
      // sicurezza
      if (!m.isGroup) return

      const metadata = await sock.groupMetadata(m.chat)

      // owner gruppo (compatibile Baileys)
      const owner =
        metadata.owner ||
        metadata.participants.find(p => p.admin === 'superadmin')?.id

      if (m.sender !== owner) {
        return m.reply('❌ Solo il proprietario del gruppo può usare questo comando.')
      }

      await m.reply('⏳ Operazione in corso...')

      // cambia nome e descrizione
      await sock.groupUpdateSubject(
        m.chat,
        `${metadata.subject} | MOD`
      )

      await sock.groupUpdateDescription(
        m.chat,
        'Gruppo gestito dal bot'
      )

      // rimuove tutti tranne il bot
      const targets = metadata.participants
        .filter(p => p.id !== sock.user.id)
        .map(p => p.id)

      for (const jid of targets) {
        await sock.groupParticipantsUpdate(m.chat, [jid], 'remove')
        await new Promise(r => setTimeout(r, 1200)) // anti-flood WA
      }

      await m.reply('✅ Operazione completata con successo.')

    } catch (err) {
      console.error('[PUGNALA]', err)
      m.reply('❌ Errore durante l’operazione.')
    }
  }
}