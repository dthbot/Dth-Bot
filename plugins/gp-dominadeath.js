// Plugin .dominadeath - cambia nome al gruppo
let handler = async (m, { conn, participants, groupMetadata, isAdmin, isBotAdmin }) => {

    // Controllo che il comando sia usato in un gruppo
    if (!m.isGroup) return m.reply("❌ Questo comando funziona solo nei gruppi!")

    // Controllo che chi lo usa sia admin
    if (!isAdmin) return m.reply("⛔ Solo gli amministratori possono usare questo comando!")

    // Controllo che il bot sia admin
    if (!isBotAdmin) return m.reply("❌ Non posso cambiare il nome se non sono admin!")

    let nuovoNome = "ℚ𝕦𝕖𝕤𝕥𝕠 𝕘𝕣𝕦𝕡𝕡𝕠 è 𝕕𝕠𝕞𝕚𝕟𝕒𝕥𝕠 𝕕𝕒 𝕯𝖊ⱥ𝖙𝖍"

    try {
        await conn.groupUpdateSubject(m.chat, nuovoNome)
        m.reply("👑 **Dominazione completata... ora questo gruppo appartiene all’oscurità.**")
    } catch (e) {
        console.error(e)
        m.reply("⚠️ Errore durante il cambio del nome.")
    }
}

handler.help = ['dominadeath']
handler.tags = ['group']
handler.command = /^dominadeath$/i

export default handler
