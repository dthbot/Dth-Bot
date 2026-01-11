// Plugin Moderatori Premium
// Creato per utenti premium simile a VareBot

module.exports = {
    name: "moderatori",
    description: "Visualizza la lista dei moderatori con stile premium ✨",
    premium: true, // Solo utenti premium
    execute(client, message, args) {

        // Controllo premium
        if (!message.member.roles.cache.some(r => r.name === "Premium")) {
            return message.channel.send("🚫 Questo comando è disponibile solo per utenti **Premium**!");
        }

        // Lista dei moderatori
        const moderatori = [
            { nome: "Admin01", ruolo: "Head Admin" },
            { nome: "Mod01", ruolo: "Moderatore Senior" },
            { nome: "Mod02", ruolo: "Moderatore Junior" },
            { nome: "Helper01", ruolo: "Helper" }
        ];

        // Creiamo un messaggio decorato
        let embedMessage = {
            color: 0x00FFFF, // colore azzurro neon
            title: "🌟 Lista Moderatori Premium 🌟",
            description: "Ecco tutti i moderatori disponibili per il server!",
            fields: [],
            footer: { text: "Grazie per essere un utente Premium ✨" },
            timestamp: new Date()
        };

        moderatori.forEach(mod => {
            embedMessage.fields.push({
                name: `👤 ${mod.nome}`,
                value: `Ruolo: **${mod.ruolo}**`,
                inline: true
            });
        });

        // Invia il messaggio embed
        message.channel.send({ embeds: [embedMessage] });
    }
};