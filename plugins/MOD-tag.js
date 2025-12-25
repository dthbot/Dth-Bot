// Assicurati di avere la lista dei moderatori come nel plugin precedente
const groupMods = {} // { "groupId": ["jid1@s.whatsapp.net", ...] }

let handler = async (m, { conn }) => {
    const chat = m.chat

    // Controllo se ci sono moderatori nel gruppo
    if (!groupMods[chat] || groupMods[chat].length === 0) {
        return m.reply('❌ Nessun moderatore in questo gruppo.')
    }

    // Testo da inviare e mentions
    let text = '👥 Moderatori del gruppo:\n\n'
    const mentions = []

    groupMods[chat].forEach((mod, i) => {
        text += `• @${mod.split('@')[0]}\n`
        mentions.push(mod)
    })

    await conn.sendMessage(chat, { text, mentions })
}

handler.command = ['tagmod']
handler.group = true
export default handler