let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return conn.reply(
            m.chat,
            '⚠️ Usa:\n• `.antitag on`\n• `.antitag off`',
            m
        )
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (args[0].toLowerCase() === 'on') {
        chat.antitag = true
        await conn.reply(m.chat, '✅ Anti-Tag *ATTIVATO*', m)
    } 
    else if (args[0].toLowerCase() === 'off') {
        chat.antitag = false
        await conn.reply(m.chat, '❌ Anti-Tag *DISATTIVATO*', m)
    } 
    else {
        await conn.reply(m.chat, '⚠️ Usa `.antitag on` o `.antitag off`', m)
    }
}

// COMANDO
handler.command = ['antitag']
handler.admin = true
handler.group = true

// MIDDLEWARE AUTOMATICO
handler.before = async function (m, { conn, participants }) {
    if (!m.isGroup) return

    let chat = global.db.data.chats[m.chat]
    if (!chat?.antitag) return

    if (!m.mentionedJid || m.mentionedJid.length < 30) return

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
        `> ⚠️ *ANTI-TAG*\n> L'utente ha fatto *Tag-All* ed è stato rimosso.\n\n👮 Admin:\n${listAdmin}`,
        m,
        { mentions: groupAdmins }
    )

    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
}

export default handler