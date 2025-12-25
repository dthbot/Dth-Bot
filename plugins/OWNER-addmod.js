// Database globale dei moderatori
const groupMods = {} // Esempio: { "groupId": ["jid1@s.whatsapp.net", "jid2@s.whatsapp.net"] }

let handler = async (m, { conn, command, usedPrefix }) => {
    const isOwner = global.owner?.includes(m.sender) || m.sender === m.chat.split('-')[0] + '@s.whatsapp.net' // solo owner
    if (!isOwner) throw '❌ Solo l’owner può usare questo comando'

    const target = m.mentionedJid?.[0] || m.quoted?.sender
    if (!target) throw `Usa: ${usedPrefix}addmod @utente`

    const chat = m.chat
    if (!groupMods[chat]) groupMods[chat] = []

    if (groupMods[chat].includes(target)) {
        return m.reply('❌ Questo utente è già moderatore')
    }

    groupMods[chat].push(target)
    m.reply(`✅ ${getName(target)} è stato aggiunto come moderatore del gruppo`)
}

// Helper per i nomi
function getName(jid) {
    return jid.split('@')[0]
}

// Comando del bot
handler.command = ['addmod']
handler.group = true
handler.owner = true // solo owner può usare
export default handler