let handler = async (m, { conn, text }) => {
    const chat = m.chat;
    conn.groupMods = conn.groupMods || {};
    const mods = conn.groupMods[chat] || [];

    if (!mods.length) return m.reply('❌ Nessun moderatore in questo gruppo.');

    // Controllo se chi manda il comando è moderatore
    if (!mods.includes(m.sender)) return m.reply('❌ Solo i moderatori possono usare questo comando.');

    // Messaggio personalizzato
    const msgText = text ? text : '👋 Attenzione ai moderatori:';

    // Crea array di menzioni
    const mentions = mods;

    // Genera il testo con i tag visibili
    let txt = msgText + '\n\n';
    for (let mod of mods) {
        txt += `• @${mod.split('@')[0]}\n`;
    }

    await conn.sendMessage(chat, { text: txt, mentions });
}

handler.command = ['tagmod'];
handler.group = true;
export default handler;