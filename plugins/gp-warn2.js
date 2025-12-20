let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {      
    if (!m.isGroup) return m.reply('❌ Questo comando funziona solo nei gruppi')
    if (!m.isAdmin) return m.reply('🚫 Solo gli admin possono usare questo comando')
    if (!m.botAdmin) return m.reply('🤖 Devo essere admin per gestire i warn')

    let who
    if (m.isGroup) {
        who = m.mentionedJid?.[0] ? m.mentionedJid[0] : m.quoted?.sender
    } else {
        who = m.chat
    }

    // inizializza dati utente
    if (!global.db.data.users[who]) global.db.data.users[who] = {}
    if (!global.db.data.users[who].warn) global.db.data.users[who].warn = 0

    const MAX_WARNS = 3
    let user = global.db.data.users[who]

    switch(command.toLowerCase()) {
        case 'warn':
        case 'ammonisci':
        case 'avvertimento':
        case 'warning':
            if (!who) return m.reply(`⚠️ Tagga un utente o rispondi a un messaggio`)
            if (user.warn < MAX_WARNS - 1) {
                user.warn += 1
                m.reply(
`╭─⚠️ *AVVERTIMENTO*
│ 👤 Utente: @${who.split("@")[0]}
│ 📊 Warn: ${user.warn}/${MAX_WARNS}
╰────────────`
                )
            } else {
                user.warn = 0
                m.reply(
`╭─⛔ *UTENTE RIMOSSO*
│ 👤 Utente: @${who.split("@")[0]}
│ ⚠️ Warn: ${MAX_WARNS}/${MAX_WARNS}
│ 🔨 Azione: *KICK*
╰────────────`
                )
                await time(1000)
                await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
            }
            break

        case 'unwarn':
            if (!who) return m.reply(`⚠️ Tagga un utente o rispondi a un messaggio`)
            if (user.warn > 0) user.warn -= 1
            m.reply(
`╭─✅ *WARN RIMOSSO*
│ 👤 Utente: @${who.split("@")[0]}
│ 📊 Warn: ${user.warn}/${MAX_WARNS}
╰────────────`
            )
            break

        case 'delwarn':
            if (!who) return m.reply(`⚠️ Tagga un utente o rispondi a un messaggio`)
            user.warn = 0
            m.reply(
`╭─🗑️ *WARN AZZERATI*
│ 👤 Utente: @${who.split("@")[0]}
│ 📊 Warn: 0/${MAX_WARNS}
╰────────────`
            )
            break

        case 'listwarn':
            let list = Object.keys(global.db.data.users)
                        .filter(u => global.db.data.users[u].warn > 0)
            if (list.length === 0) return m.reply('📭 Nessun utente ha warn')
            let text = `╭─📋 *LISTA WARN ATTIVI*\n`
            for (let u of list) {
                text += `│ 👤 @${u.split("@")[0]} → ⚠️ ${global.db.data.users[u].warn}/${MAX_WARNS}\n`
            }
            text += '╰────────────'
            m.reply(text)
            break
    }
}

// Helper
const time = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

handler.help = ['warn @user','unwarn @user','delwarn @user','listwarn']
handler.tags = ['group']
handler.command = /^(ammonisci|avvertimento|warn|warning|unwarn|delwarn|listwarn)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
