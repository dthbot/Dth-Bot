// Plugin fatto da Deadly

let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return conn.reply(
            m.chat,
            '⚠️ Usa:\n• `.antireazioni on`\n• `.antireazioni off`',
            m
        )
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (args[0].toLowerCase() === 'on') {
        chat.antireazioni = true
        await conn.reply(m.chat, '✅ Anti-Reazioni *ATTIVATO*', m)
    } 
    else if (args[0].toLowerCase() === 'off') {
        chat.antireazioni = false
        await conn.reply(m.chat, '❌ Anti-Reazioni *DISATTIVATO*', m)
    } 
    else {
        await conn.reply(m.chat, '⚠️ Usa `.antireazioni on` o `.antireazioni off`', m)
    }
}

// COMANDO
handler.command = ['antireazioni']
handler.admin = true
handler.group = true

// MIDDLEWARE AUTOMATICO
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys || m.fromMe) return true
    if (!m.isGroup) return true

    let chat = global.db.data.chats[m.chat]
    if (!chat?.antireazioni) return true
    if (isAdmin) return true
    if (!isBotAdmin) return true

    // controllo reazione
    let reaction =
        m.mtype === 'reactionMessage' ||
        m.message?.reactionMessage

    if (!reaction) return true

    let user = global.db.data.users[m.sender]
    if (!user.warn) user.warn = 0
    if (!user.warnReasons) user.warnReasons = []

    user.warn++
    user.warnReasons.push('reazione')

    // elimina la reazione
    await conn.sendMessage(m.chat, {
        delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant
        }
    })

    if (user.warn < 3) {
        await conn.sendMessage(m.chat, {
            text:
`⚠️ *REAZIONI NON CONSENTITE*

👤 Utente: @${m.sender.split('@')[0]}
📌 Avvertimento: *${user.warn}/3*

⛔ Alla terza violazione verrai rimosso`,
            mentions: [m.sender]
        })
    } else {
        user.warn = 0
        user.warnReasons = []

        await conn.sendMessage(m.chat, {
            text:
`⛔ *UTENTE RIMOSSO*

👤 @${m.sender.split('@')[0]}
📌 Motivo: *Invio di reazioni*`,
            mentions: [m.sender]
        })

        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    }

    return true
}

export default handler