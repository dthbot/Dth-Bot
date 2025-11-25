// Funzione per formattare l'uptime
function formatUptime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}

// Listener messaggi
async function handlePing(sock, msg) {
    // Recupera il testo del messaggio
    let text = '';
    if (msg.message.conversation) text = msg.message.conversation;
    else if (msg.message.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;

    if (!text) return;
    if (!text.startsWith('.ping')) return;

    // Calcola uptime
    const uptime = formatUptime(process.uptime() * 1000);

    // Calcola ping stimato (dal timestamp del messaggio)
    const msgTimestamp = msg.messageTimestamp ? msg.messageTimestamp.low || msg.messageTimestamp : Date.now();
    const ping = Date.now() - msgTimestamp * 1000;

    // Status
    const status = 'Online ✅';

    // Risposta
    await sock.sendMessage(msg.key.remoteJid, {
        text: `🏓 Pong!\nUptime: ${uptime}\nPing: ${ping}ms\nStatus: ${status}`
    });
}

module.exports = { handlePing };
