let handler = async (m, { conn, text, participants }) => {
    const gAdmins = participants.filter(p => p.admin)
    const botId = conn.user.jid
    const gOwner = gAdmins.find(p => p.isAdmin)?.id
    const gNoAdmins = participants.filter(p => p.id !== botId && p.id !== gOwner && !p.admin)

    if (participants.length === gAdmins.length || gNoAdmins.length === 0) { 
        return m.reply('*⚠️ Nessun utente valido da rimuovere (forse sono tutti admin).*')
    }

    const randomUser = gNoAdmins[Math.floor(Math.random() * gNoAdmins.length)]
    let tag = ''

    try {
        const user = await conn.getName(randomUser.id)
        tag = user || randomUser.id.split('@')[0]
    } catch {
        tag = randomUser.id.split('@')[0]
    }

    const probability = (100 / gNoAdmins.length).toFixed(2)

    // --- RISPOSTA CON TAG FUNZIONANTI ---
    await conn.reply(
        m.chat,
        `*✧ Selezione Casuale:* @${randomUser.id.split('@')[0]}\n` +
        `> Era destino che venissi scelto.\n` +
        `> Probabilità: ${probability}%`,
        m,
        {
            mentions: [randomUser.id]   // <<< QUI ATTIVI IL TAG VERO
        }
    )

    // --- RIMOZIONE ---
    try {
        await conn.groupParticipantsUpdate(m.chat, [randomUser.id], 'remove')

        await conn.reply(
            m.chat,
            `令 *@${randomUser.id.split('@')[0]}* è stato eliminato.`,
            m,
            { mentions: [randomUser.id] }
        )

        m.react('✅')
    } catch (e) {
        console.error(e)
        await conn.reply(
            m.chat,
            `❌ Non sono riuscito a rimuovere @${randomUser.id.split('@')[0]}.`,
            m,
            { mentions: [randomUser.id] }
        )
    }
}

handler.help = ['rouletteban']
handler.tags = ['giochi']
handler.command = /^(kickrandom|rouletterussa|rsban|rouletteban)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler
