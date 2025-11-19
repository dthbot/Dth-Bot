let handler = async (m, { conn }) => {
    let user;

    // Reply
    if (m.quoted) user = m.quoted.sender;
    // Mention
    else if (m.mentions && m.mentions.length > 0) user = m.mentions[0];
    // Nessuno selezionato
    else user = m.sender;

    // Garantiamo che sia una stringa
    if (!user || typeof user !== 'string') user = m.sender;

    const replyText = `
💀 *💣 CHECK DISPOSITIVO 💣*
────────────────────────
👤 Utente: ${user.split("@")[0]}
📱 Dispositivo stimato: ❓ Sconosciuto
────────────────────────
🚨 *Attento, il boss ti sta guardando!*
`;

    // 🔹 INVIO senza mentions (non da più crash)
    await m.reply(replyText);
};

handler.help = ['check @user', 'check (rispondendo a un messaggio)'];
handler.tags = ['info', 'gangster'];
handler.command = /^check$/i;

export default handler;
