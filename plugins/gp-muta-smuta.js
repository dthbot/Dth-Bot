let mutedUsers = new Map()
let spamWarnings = new Map()

function formatTimeLeft(timestamp) {
    if (!timestamp) return '*∞ Permanente*'
    const diff = timestamp - Date.now()
    if (diff <= 0) return '*✅ Scaduto*'
    const minutes = Math.ceil(diff / 60000)
    if (minutes === 0) return '< 1 min'
    return `*${minutes} min*`
}

async function getUserProfilePic(conn, userId) {
    try {
        return await conn.profilePictureUrl(userId, 'image')
    } catch {
        return 'https://i.ibb.co/BKHtdBNp/default-avatar-profile-icon-1280x1280.jpg'
    }
}

function getUserName(userId, participants) {
    const p = participants.find(p => p.id === userId)
    return p?.notify || p?.name || userId.split('@')[0]
}

let handler = async (m, { conn, command, args, participants }) => {
    const isMute = command === 'muta'
    const isUnmute = command === 'smuta'
    const isList = command === 'listamutati'

    /* ================= LISTA MUTATI ================= */
    if (isList) {
        if (!mutedUsers.size) {
            return m.reply(`ㅤㅤ⋆｡˚『 ╭ \`LISTA MUTATI\` ╯ 』˚｡⋆\n╭\n│ 『 📭 』 \`stato:\` *Nessun utente mutato*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`)
        }

        let text = `ㅤㅤ⋆｡˚『 ╭ \`LISTA MUTATI\` ╯ 』˚｡⋆\n╭\n`
        for (let [user, data] of mutedUsers.entries()) {
            text += `│ 『 🔇 』 @${user.split('@')[0]} - ${formatTimeLeft(data.timestamp)}\n`
            text += `│ 『 📝 』 \`motivo:\` *${data.reason}*\n`
        }
        text += `*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`

        return conn.sendMessage(m.chat, {
            text,
            mentions: [...mutedUsers.keys()],
            contextInfo: { ...global.fake }
        })
    }

    /* ================= RICAVO UTENTI ================= */
    let users = []

    if (m.mentionedJid?.length) {
        users = m.mentionedJid
        for (const u of m.mentionedJid) {
            args = args.filter(a => a !== '@' + u.split('@')[0])
        }
    } else if (m.quoted?.sender) {
        users = [m.quoted.sender.replace(/@c\.us$/, '@s.whatsapp.net')]
    }

    if (!users.length) {
        return m.reply(`ㅤㅤ⋆｡˚『 ╭ \`USO COMANDO\` ╯ 』˚｡⋆\n╭\n│ 『 ❌』 \`formato:\` *${command} @user [minuti] [motivo]*\n│ 『 💡 』 \`oppure:\` *rispondi a un messaggio*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`)
    }

    /* ================= VALIDAZIONE GRUPPO ================= */
    const participantIds = participants.map(p => p.id)

    users = users.filter(u =>
        participantIds.includes(u) ||
        participantIds.includes(u.replace(/@c\.us$/, '@s.whatsapp.net'))
    )

    if (!users.length) {
        return m.reply(`ㅤㅤ⋆｡˚『 ╭ \`ERRORE\` ╯ 』˚｡⋆\n╭\n│ 『 ❌ 』 \`stato:\` *Utente non valido o non nel gruppo*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`)
    }

    /* ================= TEMPO & MOTIVO ================= */
    let time = 0
    let reason = 'motivo non specificato ma meritato'

    if (args.length) {
        let match = args[0].toLowerCase().match(/^(\d+)(s|sec|m|min)?$/)
        if (match) {
            const value = parseInt(match[1])
            const unit = match[2] || 'm'
            time = unit.startsWith('s') ? value * 1000 : value * 60000
            reason = args.slice(1).join(' ') || reason
        } else {
            reason = args.join(' ')
        }
    }

    /* ================= AZIONE ================= */
    let results = []

    for (let user of users) {
        const isOwner = global.owner.map(([n]) => n + '@s.whatsapp.net').includes(user)

        if (isOwner && isMute) {
            mutedUsers.set(m.sender, {
                timestamp: Date.now() + 120000,
                reason: 'Hai provato a mutare un owner 👀',
                lastNotification: 0
            })
            return m.reply(`ㅤㅤ⋆｡˚『 ╭ \`PUNIZIONE\` ╯ 』˚｡⋆\n╭\n│ 『 👊 』 \`errore:\` *Non puoi mutare un owner*\n│ 『 🔇 』 \`punizione:\` *Sei mutato per 2 minuti*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`)
        }

        if (user === conn.user.jid) {
            return m.reply(`ㅤㅤ⋆｡˚『 ╭ \`ERRORE\` ╯ 』˚｡⋆\n╭\n│ 『 ❌ 』 \`azione:\` *Non puoi ${command}re il bot*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`)
        }

        if (isMute) {
            mutedUsers.set(user, {
                timestamp: time ? Date.now() + time : 0,
                reason,
                lastNotification: 0
            })
        } else {
            if (!mutedUsers.has(user)) {
                return m.reply(`ㅤㅤ⋆｡˚『 ╭ \`INFO\` ╯ 』˚｡⋆\n╭\n│ 『 💡 』 \`stato:\` *@${user.split('@')[0]} non è mutato*\n*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`)
            }
            mutedUsers.delete(user)
        }

        results.push(`@${user.split('@')[0]}`)
    }

    /* ================= MESSAGGIO FINALE ================= */
    const target = users[0]
    const name = getUserName(target, participants)
    const pp = await getUserProfilePic(conn, target)

    let msg = `ㅤㅤ⋆｡˚『 ╭ \`AZIONE COMPLETATA\` ╯ 』˚｡⋆\n╭\n`
    msg += `│ 『 👤 』 \`utenti:\` *${results.join(', ')}*\n`
    msg += `│ 『 ⚡ 』 \`azione:\` *${isMute ? 'mutato' : 'smutato'}*\n`
    if (isMute) msg += `│ 『 ⏱️ 』 \`durata:\` *${time ? time / 60000 + ' minuti' : '∞ Permanente'}*\n`
    msg += `│ 『 📝 』 \`motivo:\` *${reason}*\n`
    msg += `*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`

    await conn.sendMessage(m.chat, {
        text: msg,
        mentions: users,
        contextInfo: {
            ...global.fake.contextInfo,
            externalAdReply: {
                title: name,
                body: isMute ? 'Utente mutato' : 'Utente smutato',
                thumbnailUrl: pp,
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    })
}

/* ================= BLOCCO MESSAGGI MUTATI ================= */
handler.before = async (m, { conn }) => {
    if (!mutedUsers.has(m.sender) || m.sender === conn.user.jid) return

    const data = mutedUsers.get(m.sender)
    if (data.timestamp && Date.now() > data.timestamp) {
        mutedUsers.delete(m.sender)
        return
    }

    try {
        await conn.sendMessage(m.chat, { delete: m.key })
    } catch {}

    return false
}

handler.help = ['muta', 'smuta', 'listamutati']
handler.tags = ['gruppo']
handler.command = /^(muta|smuta|listamutati)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
