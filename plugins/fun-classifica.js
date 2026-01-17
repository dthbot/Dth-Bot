let handler = async (m, { conn }) => {
    if (!m.isGroup) {
        return conn.sendMessage(m.chat, { text: '❌ Comando utilizzabile solo nei gruppi' })
    }

    const groupMetadata = await conn.groupMetadata(m.chat)
    const participants = groupMetadata.participants

    // Membri con id + nome
    const members = participants.map(p => ({
        id: p.id,
        name: p.notify || p.name || p.id.split('@')[0]
    }))

    const scores = members.map(() => Math.floor(Math.random() * 100))

    const sorted = members
        .map((u, i) => ({ ...u, score: scores[i] }))
        .sort((a, b) => b.score - a.score)

    let message = `
═══════════════════
🏆 𝐂𝐋𝐀𝐒𝐒𝐈𝐅𝐈𝐂𝐀 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐏𝐎 🏆
═══════════════════
`.trim() + '\n\n'

    const mentions = []

    sorted.forEach((u, i) => {
        const medal =
            i === 0 ? '🥇' :
            i === 1 ? '🥈' :
            i === 2 ? '🥉' : `#${i + 1}`

        message += `✦ ${medal}  @${u.id.split('@')[0]} — 𝑷𝒖𝒏𝒕𝒊: ${u.score}\n`
        message += '───────────────────\n'
        mentions.push(u.id)
    })

    message += '\n🎉 Complimenti ai partecipanti! 🎉'

    const messageOptions = {
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
    }

    await conn.sendMessage(m.chat, { text: message, ...messageOptions })
}

handler.command = /^(classifica|rank)$/i

export default handler