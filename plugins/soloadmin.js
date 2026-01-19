let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return conn.reply(
            m.chat,
            '⚠️ Usa:\n• `.soloadmin on`\n• `.soloadmin off`',
            m
        )
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (args[0].toLowerCase() === 'on') {
        chat.soloAdmin = true
        await conn.reply(m.chat, '🔒 Modalità *SOLO ADMIN* **ATTIVATA**', m)
    } 
    else if (args[0].toLowerCase() === 'off') {
        chat.soloAdmin = false
        await conn.reply(m.chat, '🔓 Modalità *SOLO ADMIN* **DISATTIVATA**', m)
    } 
    else {
        await conn.reply(m.chat, '⚠️ Usa `.soloadmin on` o `.soloadmin off`', m)
    }
}

// COMANDO
handler.command = ['soloadmin']
handler.admin = true
handler.group = true

// MIDDLEWARE AUTOMATICO
handler.before = async function (m, { conn, participants, isAdmin, isBotAdmin }) {
    if (!m.isGroup) return
    if (!m.text) return
    if (m.text.startsWith('.soloadmin')) return

    let chat = global.db.data.chats[m.chat]
    if (!chat?.soloAdmin) return

    const groupAdmins = participants
        .filter(p => p.admin)
        .map(p => p.id)

    const isUserAdmin = groupAdmins.includes(m.sender)
    const isBot = m.sender === conn.user.jid

    if (isUserAdmin || isBot) return

    // BLOCCA COMANDI AI MEMBRI
    if (m.text.startsWith('.')) {
        await conn.reply(
            m.chat,
            '🚫 *SOLO ADMIN*\nSolo gli amministratori possono usare i comandi.',
            m
        )
        return true // blocca l'esecuzione del comando
    }
}

export default handler