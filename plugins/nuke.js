export default async function handler(m, { sock }) {
  try {
    if (!m.isGroup) return
    if (m.text !== '.pugnala') return

    const groupMetadata = await sock.groupMetadata(m.chat)
    const owner =
      groupMetadata.owner ||
      groupMetadata.participants.find(p => p.admin === 'superadmin')?.id

    // solo owner del gruppo
    if (m.sender !== owner) return

    await sock.sendMessage(m.chat, {
      text: '𝐁𝐥𝐨𝐨𝐝 𝐞̀ 𝐚𝐫𝐫𝐢𝐯𝐚𝐭𝐨 𝐢𝐧 𝐜𝐢𝐫𝐜𝐨𝐥𝐚𝐳𝐢𝐨𝐧𝐞.'
    })

    await sock.sendMessage(m.chat, {
      text: '𝐀𝐯𝐞𝐭𝐞 𝐚𝐯𝐮𝐭𝐨 𝐥\'𝐨𝐧𝐨𝐫𝐞.'
    })

    // cambia nome e descrizione
    await sock.groupUpdateSubject(m.chat, `${groupMetadata.subject} *SVT BY BLOOD*`)
    await sock.groupUpdateDescription(m.chat, 'GRUPPO PUGNALATO DA BLOOD')

    // rimuove tutti tranne bot
    const participants = groupMetadata.participants
      .filter(p => p.id !== sock.user.id)
      .map(p => p.id)

    for (const jid of participants) {
      await sock.groupParticipantsUpdate(m.chat, [jid], 'remove')
      await new Promise(r => setTimeout(r, 1000)) // anti-flood
    }

    console.log('✅ Gruppo svuotato')

  } catch (err) {
    console.error('❌ Errore nuke:', err)
  }
}