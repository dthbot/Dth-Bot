let handler = async (m, { conn, usedPrefix }) => {
    const users = global.db.data.users
    const sender = m.sender

    // auto-creazione mittente
    if (!users[sender]) {
        users[sender] = {
            exp: 0,
            money: 0,
            level: 0,
            adopted: [],
            parent: null
        }
    }

    const target =
        m.mentionedJid && m.mentionedJid[0]
            ? m.mentionedJid[0]
            : m.quoted
            ? m.quoted.sender
            : null

    if (!target)
        return m.reply(`Tagga qualcuno da adottare!\nEsempio: ${usedPrefix}adotta @utente`)

    if (target === sender)
        return m.reply('❌ Non puoi adottare te stesso.')

    // auto-creazione adottato
    if (!users[target]) {
        users[target] = {
            exp: 0,
            money: 0,
            level: 0,
            adopted: [],
            parent: null
        }
    }

    if (users[target].parent)
        return m.reply('❌ Questa persona è già stata adottata.')

    // salva relazione
    users[target].parent = sender
    users[sender].adopted.push(target)

    await conn.sendMessage(m.chat, {
        text:
`👨‍👩‍👧 *ADOZIONE COMPLETATA!*  

@${sender.split('@')[0]} ha adottato @${target.split('@')[0]} 💖  

Ora fanno parte della stessa famiglia!`,
        mentions: [sender, target]
    })
}

handler.help = ['adotta @utente']
handler.tags = ['fun']
handler.command = /^adotta$/i
handler.group = true

export default handler