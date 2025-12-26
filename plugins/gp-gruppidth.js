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
        const members = g.participants?.length || 0
        txt += `─────────────────\n`
        txt += `👑 Nome gruppo: *${groupName}*\n`
        txt += `👥 Membri: *${members}*\n`
        txt += `🆔 ID: ${g.id}\n`
        txt += `─────────────────\n\n`
    }

    await conn.sendMessage(m.chat, {
        text: txt,
        mentions: groups.map(g => g.id)
    }, { quoted: m })
}

handler.help = ['gruppidth']
handler.tags = ['info']
handler.command = ['gruppidth']
handler.group = false
export default handler