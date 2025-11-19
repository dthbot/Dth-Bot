let handler = async (m, { conn }) => {
    let user;

    // 1️⃣ Risposta a un messaggio
    if (m.quoted) {
        user = m.quoted.sender;

        // Stimiamo il dispositivo: Android/iPhone/Web/Desktop non si può sapere con certezza
        // quindi solo messaggio gangster generico
        return m.reply(`
💀 *💣 CHECK DISPOSITIVO 💣*
────────────────────────
👤 Utente: @${user.split("@")[0]}
📱 Dispositivo stimato: ❓ Sconosciuto
────────────────────────
🚨 *Attento, il boss ti sta guardando!*
`, { mentions: [user] });
    }

    // 2️⃣ Menzione
    else if (m.mentions && m.mentions.length > 0) {
        user = m.mentions[0];
        return m.reply(`⚠️ Non posso stimare il dispositivo di @${user.split("@")[0]} perché non ci sono messaggi recenti da analizzare.`, { mentions: [user] });
    }

    // 3️⃣ Nessuno selezionato
    else {
        return m.reply("❌ Devi rispondere a un messaggio o menzionare un utente!\n\nEsempio:\n• `.check @utente`\n• Rispondi ad un messaggio e fai `.check`");
    }
};

handler.help = ['check @user', 'check (rispondendo a un messaggio)'];
handler.tags = ['info', 'gangster'];
handler.command = /^check$/i;

export default handler;
