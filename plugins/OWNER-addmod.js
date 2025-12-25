// Database globale dei moderatori
const groupMods = {} // { "groupId": ["jid1@s.whatsapp.net", ...] }

// Lista degli owner autorizzati
const authorizedOwners = [
    '447529688238@s.whatsapp.net', // creatore
    '447529503948@s.whatsapp.net', // vixiie
    '48726875208@s.whatsapp.net',  // vampexe
    '212775499775@s.whatsapp.net'  // hell
]

let handler = async (m, { conn, command, usedPrefix }) => {
    // Controllo se chi invia è autorizzato
    if (!authorizedOwners.includes(m.sender)) 
        throw '❌ Solo gli owner autorizzati possono usare questo comando'

    const target = m.mentionedJid?.[0] || m.quoted?.sender
    if (!target) throw `Usa: ${usedPrefix}addmod @utente`

    const chat = m.chat
    if (!groupMods[chat]) groupMods[chat] = []

    if (groupMods[chat].includes(target)) {
        return m.reply('❌ Questo utente è già moderatore')
    }

    groupMods[chat].push(target)
    m.reply(`✅ @${target.split('@')[0]} è stato aggiunto come moderatore del gruppo`, null, { mentions: [target] })
}

// Funzione helper per rimuovere un moderatore
handler.removemod = async (m, { conn, usedPrefix }) => {
    if (!authorizedOwners.includes(m.sender)) 
        throw '❌ Solo gli owner autorizzati possono usare questo comando'

    const target = m.mentionedJid?.[0] || m.quoted?.sender
    if (!target) throw `Usa: ${usedPrefix}removemod @utente`

    const chat = m.chat
    if (!groupMods[chat] || !groupMods[chat].includes(target)) 
        return m.reply('❌ Questo utente non è moderatore')

    groupMods[chat] = groupMods[chat].filter(u => u !== target)
    m.reply(`✅ @${target.split('@')[0]} è stato rimosso dai moderatori`, null, { mentions: [target] })
}

// Comando del bot
handler.command = ['addmod']
handler.group = true
handler.owner = true // solo owner può usare
export default handler