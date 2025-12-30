export default async function handler(m, { sock }) {
  if (!m.isGroup) return
  if (m.text !== '.pugnala') return

  const metadata = await sock.groupMetadata(m.chat)

  const owner =
    metadata.owner ||
    metadata.participants.find(p => p.admin === 'superadmin')?.id

  if (m.sender !== owner) {
    return m.reply('❌ Solo il proprietario del gruppo.')
  }

  await m.reply('⏳ Operazione in corso...')

  await sock.groupUpdateSubject(
    m.chat,
    `${metadata.subject} | MOD`
  )

  await sock.groupUpdateDescription(
    m.chat,
    'Gruppo gestito dal bot'
  )

  const targets = metadata.participants
    .filter(p => p.id !== sock.user.id)
    .map(p => p.id)

  for (const jid of targets) {
    await sock.groupParticipantsUpdate(m.chat, [jid], 'remove')
    await new Promise(r => setTimeout(r, 1200))
  }

  m.reply('✅ Operazione completata.')
}

handler.command = ['pugnala']
handler.tags = ['group']
handler.group = true
handler.botAdmin = true