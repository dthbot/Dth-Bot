module.exports = {
    name: 'ping',
    description: 'Mostra il ping del bot e il tempo online',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // Calcola il ping
        const start = Date.now();
        const latency = Date.now() - start;

        // Tempo online del bot
        const uptimeSeconds = process.uptime();
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);
        const uptime = `${hours}h ${minutes}m ${seconds}s`;

        // Messaggio decorato
        const messageText = `
╔═〘 𝐏𝐈𝐍𝐆 〙═
║🏓 Ping: ${latency}ms
║⏱️ Online: ${uptime}
╚════════════
        `;

        // Invia il messaggio
        await sock.sendMessage(from, { text: messageText });
    }
};
