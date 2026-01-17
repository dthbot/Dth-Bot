let handler = async (m, { conn }) => {
    if (!m.isGroup) {
        return conn.sendMessage(m.chat, { text: '❌ Comando utilizzabile solo nei gruppi' })
    }

    const groupMetadata = await conn.groupMetadata(m.chat)
    const participants = groupMetadata.participants

    const members = participants.map(p => {
        const jid = p.id
        const userData = global.db?.data?.users?.[jid]

        return {
            id: jid,
            name: p.notify || p.name || jid.split('@')[0],
            messages: userData?.chat || 0
        }
    })

    // Ordina per numero di messaggi
    const sorted = members.sort((a, b) => b.messages - a.messages)

    let message = `
═══════════════════
🏆 𝐂𝐋𝐀𝐒𝐒𝐈𝐅𝐈𝐂𝐀 𝐌𝐄𝐒𝐒𝐀𝐆𝐆𝐈 🏆
═══════════════════
`.trim() + '\n\n'

    const mentions = []

    sorted.forEach((u, i) => {
        const medal =
            i === 0 ? '🥇' :
            i === 1 ? '🥈' :
            i === 2 ? '🥉' : `#${i + 1}`

        message += `✦ ${medal}  @${u.id.split('@')[0]} — 💬 Messaggi: ${u.messages}\n`
        message += '───────────────────\n'
        mentions.push(u.id)
    })

    message += '\n🔥 Continuate a scrivere! 🔥'

    await conn.sendMessage(m.chat, {
        text: message,
        contextInfo: {
            mentionedJid: mentions,
            forwardingScore: 0,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363406461040669@newsletter',
                serverMessageId: '',
                newsletterName: `${conn.user.name}`
            }
        }
    })
}

handler.command = /^(classifica|rank)$/i
export default handler