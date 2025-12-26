// Plugin fatto da Axtral_WiZaRd (fix + on/off)

let telegramRegex = /(?:https?:\/\/)?(?:www\.)?(t\.me|telegram\.me)\/[^\s]*/i

let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return conn.reply(
            m.chat,
            '⚠️ Usa:\n• `.antitelegram on`\n• `.antitelegram off`',
            m
        )
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (args[0].toLowerCase() === 'on') {
        chat.antitelegram = true
        await conn.reply(m.chat, '✅ Anti-Telegram *ATTIVATO*', m)
    } 
    else if (args[0].toLowerCase() === 'off') {
        chat.antitelegram = false
        await conn.reply(m.chat, '❌ Anti-Telegram *DISATTIVATO*', m)
    } 
    else {
        await conn.reply(m.chat, '⚠️ Usa `.antitelegram on` o `.antitelegram off`', m)
    }
}

// COMANDO
handler.command = ['antitelegram']
handler.admin = true
handler.group = true

// MIDDLEWARE AUTOMATICO
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys || m.fromMe) return true
    if (!m.isGroup || !m.text) return true

    let chat = global.db.data.chats[m.chat]
    if (!chat?.antitelegram) return true
    if (isAdmin) return true
    if (!isBotAdmin) return true
    if (!telegramRegex.test(m.text)) return true

    let user = global.db.data.users[m.sender]
    if (!user.warn) user.warn = 0
    if (!user.warnReasons) user.warnReasons = []

    user.warn++
    user.warnReasons.push('link telegram')

    // elimina messaggio
    await conn.sendMessage(m.chat, {
        delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant,
        }
    })

    if (user.warn < 3) {
        await conn.sendMessage(m.chat, {
            text:
`⚠️ *LINK TELEGRAM NON CONSENTITI*

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
📌 Motivo: *Link Telegram*`,
            mentions: [m.sender]
        })

        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    }

    return true
}

export default handler