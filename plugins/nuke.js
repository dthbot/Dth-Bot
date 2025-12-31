let handler = async (m, { conn, isBotAdmin }) => {
    if (!isBotAdmin) return

    let bot = global.db.data.settings[conn.user.jid] || {}
    if (!bot.restrict) return

    // prende metadata REALI del gruppo
    let metadata = await conn.groupMetadata(m.chat)
    let participants = metadata.participants

    let users = participants
        .filter(u => !u.admin) // solo non admin
        .map(u => u.id)
        .filter(u => u !== conn.user.jid)

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
            await delay(1500) // evita ban
        } catch (e) {
            console.log('Errore rimozione:', user)
        }
    }
}

handler.command = /^(67)$/i
handler.group = true
handler.owner = true
handler.fail = null

export default handler