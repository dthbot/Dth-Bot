let war = 3 // Limite massimo di avvertimenti

let handler = async (m, { conn, text, args, usedPrefix, command }) => {      
    // Controllo se il plugin è disattivato tramite il tuo comando .risposte
    if (global.db.data.chats[m.chat]?.risposte === false) return

    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else who = m.chat

    if (!who) return m.reply(`*⚠️ Specifica un utente!*\n\nEsempio: _${usedPrefix + command} @utente_`)
    if (!(who in global.db.data.users)) return m.reply(`*❌ Utente non trovato nel database.*`)

    let user = global.db.data.users[who]
    let name = await conn.getName(who)
    user.warn = user.warn || 0

    // LOGICA PER RESET WARN (delwarn)
    if (command.match(/^(delwarn|unwarn|resetwarn)$/i)) {
        user.warn = 0
        return conn.reply(m.chat, `✅ **RESET EFFETTUATO**\n\nGli avvertimenti di @${who.split`@`[0]} sono stati azzerati.`, m, { mentions: [who] })
    }

    // LOGICA PER AGGIUNGERE WARN (warn)
    if (user.warn < (war - 1)) {
        user.warn += 1
        let caption = `
┏━〔 **⚠️ AVVERTIMENTO** 〕━┓
┃
┃ 👤 **Utente:** @${who.split`@`[0]}
┃ 📝 **Stato:** ${user.warn} / ${war}
┃
┗━━━━━━━━━━━━━━━━━━━━┛

*Attenzione ${name}, rispetta il regolamento per non essere rimosso!*`.trim()

        await conn.reply(m.chat, caption, m, { mentions: [who] })
    } else {
        user.warn = 0 
        let finalMessage = `
┏━━〔 **⛔ ESPULSIONE** 〕━━┓
┃
┃ 👤 **Utente:** @${who.split`@`[0]}
┃ 📉 **Motivo:** Raggiunto limite warn (${war}/${war})
┃ 🛡️ **Azione:** Rimozione in corso...
┃
┗━━━━━━━━━━━━━━━━━━━━━┛`.trim()

        await conn.reply(m.chat, finalMessage, m, { mentions: [who] })
        await time(1500)
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
    }
}

handler.help = ['warn @user', 'delwarn @user']
handler.tags = ['group']
handler.command = /^(ammonisci|avvertimento|warn|warning|delwarn|unwarn|resetwarn)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const time = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
