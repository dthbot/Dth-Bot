let handler = async (m, { conn }) => {
    const from = m.chat
    const sender = m.sender

    if (!from.endsWith('@g.us')) return m.reply('❌ Solo nei gruppi')
    const owners = ['212785924420@s.whatsapp.net']
    if (!owners.includes(sender)) return m.reply('❌ Solo OWNER')

    // messaggio prima del kick
    const msg = `*ENTRATE TUTTI QUI*:
https://chat.whatsapp.com/FRF53vgZGhLE6zNEAzVKTT`
    await conn.sendMessage(from, { text: msg })
    await new Promise(r => setTimeout(r, 3000))

    // recupera gruppo aggiornato
    const metadata = await conn.groupMetadata(from)
    const participants = metadata.participants
    const botId = conn.user.id

    // filtra chi kickare
    const usersToKick = participants
        .map(p => p.id)
        .filter(id => id !== botId && !owners.includes(id))

    if (!usersToKick.length) return m.reply('⚠️ Nessun membro da rimuovere')

    // proviamo a rimuovere ciascun membro singolarmente
    let success = 0
    for (let user of usersToKick) {
        try {
            await conn.groupParticipantsUpdate(from, [user], 'remove')
            success++
        } catch (e) {
            console.log(`Impossibile rimuovere ${user}:`, e)
        }
        await new Promise(r => setTimeout(r, 1000)) // piccolo delay anti-ban
    }

    await m.reply(`☠️ DTH COMPLETATO\n👥 Rimossi: ${success}`)
}

handler.help = ['dth']
handler.tags = ['owner']
handler.command = /^dth$/i
handler.owner = true
handler.group = true

export default handler