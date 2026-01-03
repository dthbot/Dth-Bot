
// Plugin fatto da Deadly

let MAX_LENGTH = 800 // 🔧 modifica qui la lunghezza massima consentita

let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return conn.reply(
            m.chat,
            '⚠️ Usa:\n• `.antibot on`\n• `.antibot off`',
            m
        )
    }

    let chat = global.db.data.chats[m.chat]
    if (!chat) global.db.data.chats[m.chat] = {}

    if (args[0].toLowerCase() === 'on') {
        chat.antibot = true
        await conn.reply(m.chat, '🤖 Anti-Bot *ATTIVATO*', m)
    } 
    else if (args[0].toLowerCase() === 'off') {
        chat.antibot = false
        await conn.reply(m.chat, '❌ Anti-Bot *DISATTIVATO*', m)
    } 
    else {
        await conn.reply(m.chat, '⚠️ Usa `.antibot on` o `.antibot off`', m)
    }
}

// COMANDO
handler.command = ['antibot']
handler.admin = true
handler.group = true

// MIDDLEWARE AUTOMATICO
handler.before = async function (m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys || m.fromMe) return true
    if (!m.isGroup || !m.text) return true

    let chat = global.db.data.chats[m.chat]
    if (!chat?.antibot) return true
    if (isAdmin) return true
    if (!isBotAdmin) return true

    // 🔍 controllo messaggio lungo (tipico bot/menu)
    if (m.text.length < MAX_LENGTH) return true

    // elimina messaggio
    await conn.sendMessage(m.chat, {
        delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.key.participant,
        }
    })

    await conn.sendMessage(m.chat, {
        text:
`🤖 *MESSAGGIO BLOCCATO*

👤 @${m.sender.split('@')[0]}
📌 Motivo: *Messaggio troppo lungo (possibile bot)*`,
        mentions: [m.sender]
    })

    return true
}

export default handler