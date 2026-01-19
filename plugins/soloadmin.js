let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return conn.reply(
            m.chat,
            '⚠️ Usa:\n• `.soloadmin on`\n• `.soloadmin off`',
            m
        )
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat) chat = global.db.data.chats[m.chat] = {}

    if (args[0].toLowerCase() === 'on') {
        chat.soloAdmin = true
        await conn.reply(m.chat, '🔒 *SOLO ADMIN* attivato', m)
    } else if (args[0].toLowerCase() === 'off') {
        chat.soloAdmin = false
        await conn.reply(m.chat, '🔓 *SOLO ADMIN* disattivato', m)
    } else {
        await conn.reply(m.chat, '⚠️ Usa `.soloadmin on` o `.soloadmin off`', m)
    }
}

// COMANDO
handler.command = ['soloadmin']
handler.admin = true
handler.group = true

// BLOCCO COMANDI (CHATUNITY)
handler.all = async function (m, { conn, participants }) {
    if (!m.isGroup) return
    if (!m.text) return
    if (!m.text.startsWith('.')) return
    if (m.text.startsWith('.soloadmin')) return

    let chat = global.db.data.chats[m.chat]
    if (!chat?.soloAdmin) return

    const admins = participants
        .filter(p => p.admin)
        .map(p => p.id)

    const isAdmin = admins.includes(m.sender)
    const isBot = m.sender === conn.user.jid

    if (isAdmin || isBot) return

    await conn.reply(
        m.chat,
        '🚫 *SOLO ADMIN*\nQuesto comando è riservato agli amministratori.',
        m
    )

    return true // ⛔ BLOCCA IL COMANDO (ChatUnity)
}

export default handler