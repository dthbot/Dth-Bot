let handler = async (m, { conn }) => {
    // Recupera tutti i gruppi dove il bot è presente
    const chats = await conn.groupFetchAllParticipating()
    const groups = Object.values(chats)

    if (groups.length === 0) {
        return m.reply('❌ Il bot non è in nessun gruppo al momento.')
    }

    let txt = '📜 *GRUPPI DOVE SONO PRESENTE*\n\n'

    for (let i = 0; i < groups.length; i++) {
        const g = groups[i]
        const groupName = g.subject || 'Sconosciuto'
        const participants = g.participants || []
        const membersCount = participants.length

        txt += `─────────────────\n`
        txt += `👑 Nome gruppo: *${groupName}*\n`
        txt += `👥 Membri: *${membersCount}*\n`

        // Classifica dei più attivi (serve contatore di messaggi in global.db.data.users)
        let rankings = participants.map(p => {
            const user = global.db.data.users[p.id] || {}
            return {
                id: p.id,
                name: p.name || p.id.split('@')[0],
                messages: user.messages || 0
            }
        }).sort((a, b) => b.messages - a.messages)

        if (rankings.length > 0) {
            txt += `🏆 Top 3 membri più attivi:\n`
            rankings.slice(0, 3).forEach((u, index) => {
                txt += `• ${index + 1}. ${u.name} — ${u.messages} msg\n`
            })
        } else {
            txt += `🏆 Nessun dato sui messaggi.\n`
        }

        txt += `─────────────────\n\n`
    }

    await conn.sendMessage(m.chat, {
        text: txt,
        mentions: groups.flatMap(g => g.participants.map(p => p.id))
    }, { quoted: m })
}

handler.help = ['gruppidth']
handler.tags = ['info']
handler.command = ['gruppidth']
handler.group = false
export default handler