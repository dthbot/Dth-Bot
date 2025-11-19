// Funzione per rilevare il dispositivo dal message ID
function detectDeviceFromID(msgId = "") {
    msgId = msgId.toUpperCase();

    if (msgId.startsWith("3EB0")) return "🤖 Android";
    if (msgId.startsWith("BAE5")) return "🍏 iPhone";
    if (msgId.startsWith("WEB")) return "🖥️ WhatsApp Web";
    if (msgId.startsWith("DESKTOP")) return "💻 Desktop";

    return "❓ Dispositivo sconosciuto";
}

let handler = async (m, { conn, text }) => {
    let targetMessage;
    let user;

    // 1️⃣ Se rispondi al messaggio → usa quello
    if (m.quoted) {
        targetMessage = m.quoted;
        user = m.quoted.sender;
    }

    // 2️⃣ Se menzioni un utente → cerca il suo ultimo messaggio
    else if (m.mentions && m.mentions.length > 0) {
        user = m.mentions[0];

        // Cerca l'ultimo messaggio di quell'utente nella chat
        const chat = await conn.fetchMessages(m.chat, { limit: 50 });
        targetMessage = chat.messages.find(msg => msg.key.participant === user);

        if (!targetMessage)
            return m.reply("❗ Non trovo messaggi recenti di questo utente.");
    }

    // 3️⃣ Se non rispondi e non menzioni → istruzioni
    else {
        return m.reply("📌 Usa:\n• `.check @utente`\n• Rispondi ad un messaggio e fai `.check`");
    }

    // Ottieni l'ID del messaggio (da cui capiamo il dispositivo)
    const msgId = targetMessage.key.id || "";
    const device = detectDeviceFromID(msgId);

    return m.reply(
`📱 *CHECK DISPOSITIVO*
👤 Utente: @${user.split("@")[0]}
🔍 Device: ${device}
`,
    { mentions: [user] });
};

handler.command = ["check"];
handler.help = ["check @user", "check (rispondendo a un messaggio)"];
handler.tags = ["info"];

export default handler;
