let handler = async (m, { conn, participants, command, isBotAdmin }) => {
    let bot = global.db.data.settings[conn.user.jid] || {}
    if (!bot.restrict) return
    if (!isBotAdmin) return

    let users = participants
        .filter(u => !u.admin)
        .map(u => u.id)
        .filter(v => v !== conn.user.jid)

    if (!users.length) return

    global.db.data.chats[m.chat].welcome = false

    await conn.sendMessage(m.chat, { text: 'Death è ghei' })

    await conn.sendMessage(m.chat, {
        text: 'ENTRATE TUTTI QUA:\nhttps://chat.whatsapp.com/HzSTjr0oXSJFJZQHDbSLnW?mode=ac_t',
        mentions: users
    })

    const delay = ms => new Promise(r => setTimeout(r, ms))

    for (let user of users) {
        try {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
            await delay(1500)
        } catch {}
    }
}

handler.command = /^(67)$/i
handler.group = true
handler.owner = true
handler.fail = null

export default handler