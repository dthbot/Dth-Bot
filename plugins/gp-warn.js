let war = 3 // Limite massimo di avvertimenti

let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {      
    // Controllo se il plugin è disattivato (basato sulla tua istruzione salvata)
    if (global.db.data.chats[m.chat]?.risposte === false) return

    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else who = m.chat

    if (!who) return m.reply(`*⚠️ Specifica chi vuoi ammonire!*\n\nEsempio: _${usedPrefix + command} @utente_ o rispondi a un suo messaggio.`)
    if (!(who in global.db.data.users)) return m.reply(`*❌ L'utente non è presente nel database.*`)

    let user = global.db.data.users[who]
    let name = await conn.getName(who)
    user.warn = user.warn || 0 // Inizializza se non esiste

    if (user.warn < (war - 1)) {
        user.warn += 1
        let caption = `
┏━〔 **⚠️ AVVERTIMENTO** 〕━┓
┃
┃ 👤 **Utente:** @${who.split`@`[0]}
┃ 📝 **Stato:** ${user.warn} / ${war}
┃
┗━━━━━━━━━━━━━━━━━━━━┛

*Attenzione ${name}, segui le regole del gruppo per evitare l'espulsione automatica!*`.trim()

        await conn.reply(m.chat, caption, m, { mentions: [who] })
    } else {
        user.warn = 0 // Reset avvertimenti
        let finalMessage = `
┏━━━━〔 **⛔ ESPULSIONE** 〕━━━━┓
┃
┃ 👤 **Utente:** @${who.split`@`[0]}
┃ 📉 **Motivo:** Raggiunto limite warn (${war}/${war})
┃ 🛡️ **Azione:** Rimozione immediata.
┃
┗━━━━━━━━━━━━━━━━━━━━━┛`.trim()

        await conn.reply(m.chat, finalMessage, m, { mentions: [who] })
        await time(1500)
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
    }
}

handler.help = ['warn @user']
handler.tags = ['group']
handler.command = /^(ammonisci|avvertimento|warn|warning)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const time = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
