let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return conn.reply(
            m.chat,
            '⚠️ Usa:\n• `.antilink on`\n• `.antilink off`',
            m
        )
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (args[0].toLowerCase() === 'on') {
        chat.antilink = true
        await conn.reply(m.chat, '✅ Anti-Link *ATTIVATO*', m)
    } 
    else if (args[0].toLowerCase() === 'off') {
        chat.antilink = false
        await conn.reply(m.chat, '❌ Anti-Link *DISATTIVATO*', m)
    } 
    else {
        await conn.reply(m.chat, '⚠️ Usa `.antilink on` o `.antilink off`', m)
    }
}

// COMANDO
handler.command = ['antilink']
handler.admin = true
handler.group = true

// MIDDLEWARE AUTOMATICO
handler.before = async function (m, { conn, participants }) {
    if (!m.isGroup) return

    let chat = global.db.data.chats[m.chat]
    if (!chat?.antilink) return
    if (!m.text) return

    // LINK WHATSAPP
    let linkRegex = /(chat\.whatsapp\.com\/|wa\.me\/)/i
    if (!linkRegex.test(m.text)) return

    const groupAdmins = participants
        .filter(p => p.admin)
        .map(p => p.id)

    const isAdmin = groupAdmins.includes(m.sender)
    const isBot = m.sender === conn.user.jid

    if (isAdmin || isBot) return

    let listAdmin = groupAdmins
        .map(v => `- @${v.split('@')[0]}`)
        .join('\n')

    await conn.reply(
        m.chat,
        `> ⚠️ *ANTI-LINK WHATSAPP*\n> L'utente ha inviato un *link WhatsApp* ed è stato rimosso.\n\n👮 Admin:\n${listAdmin}`,
        m,
        { mentions: groupAdmins }
    )

    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
}

export default handler