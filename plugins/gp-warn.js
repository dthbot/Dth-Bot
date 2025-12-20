let war = 3 // Soglia massima

let handler = async (m, { conn, text, args, usedPrefix, command }) => {      
    // Controllo toggle richiesto (.risposte on/off)
    if (global.db.data.chats[m.chat]?.risposte === false) return

    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else who = m.chat

    if (!who) return m.reply(`*⚠️ Tagga qualcuno o rispondi a un suo messaggio!*\n\nEsempio: _${usedPrefix + command} @utente_`)
    
    // Inizializzazione dati utente se non presenti
    if (!global.db.data.users[who]) global.db.data.users[who] = { warn: 0 }
    let user = global.db.data.users[who]
    let name = await conn.getName(who)

    // --- LOGICA TOGLIWARN ---
    if (command === 'togliwarn') {
        if (!user.warn || user.warn === 0) {
            return m.reply(`⚠️ L'utente @${who.split`@`[0]} non ha alcun avvertimento da rimuovere.`, null, { mentions: [who] })
        }
        user.warn = 0 // Azzera tutti i warn
        return conn.reply(m.chat, `✅ **AVVERTIMENTI AZZERATI**\n\nTutti i warn di @${who.split`@`[0]} sono stati rimossi con successo.`, m, { mentions: [who] })
    }

    // --- LOGICA WARN (Aggiungi) ---
    user.warn = (user.warn || 0) + 1

    if (user.warn < war) {
        let caption = `
┏━〔 *⚠️ AVVERTIMENTO* 〕━┓
┃
┃ 👤 **Utente:** @${who.split`@`[0]}
┃ 📝 **Stato:** ${user.warn} / ${war}
┃
┗━━━━━━━━━━━━━━━━━━━━┛
`.trim()
        await conn.reply(m.chat, caption, m, { mentions: [who] })
    } else {
        user.warn = 0 // Reset per il futuro
        let finalMessage = `
┏━━〔 *⛔ ESPULSIONE* 〕━━┓
┃
┃ 👤 **Utente:** @${who.split`@`[0]}
┃ 📉 **Motivo:** Raggiunto limite warn (${war}/${war})
┃ 🛡️ **Azione:** Rimozione automatica in corso...
┃
┗━━━━━━━━━━━━━━━━━━━━━┛`.trim()

        await conn.reply(m.chat, finalMessage, m, { mentions: [who] })
        await time(1500)
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
    }
}

handler.help = ['warn @user', 'togliwarn @user']
handler.tags = ['group']
// Elenco comandi aggiornato
handler.command = /^(warn|warning|ammonisci|togliwarn)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

const time = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
    }
