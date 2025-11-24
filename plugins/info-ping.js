const fs = require('fs');

module.exports = {
    name: 'ping',
    description: 'Ping del bot con miniatura non cliccabile',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // Calcola il ping
        const start = Date.now();
        const latency = Date.now() - start;

        // Tempo online
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

        // Invia testo con thumbnail non cliccabile
        await sock.sendMessage(from, {
            text: messageText,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: 'Ping Bot',
                    body: '',
                    mediaType: 2,
                    thumbnail: fs.readFileSync('./media/ping.jpeg'),
                    sourceUrl: 'https://github.com/' // qualsiasi link, serve a WhatsApp per "agganciare" la thumbnail
                }
            }
        });
    }
};
