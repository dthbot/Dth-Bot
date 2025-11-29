// fun-rsban.js — compatibile con ES Modules

export default {
    name: "rsban",
    description: "Roulette ban",
    command: ".rsban",

    async run(sock, msg) {
        try {
            const from = msg.key.remoteJid;

            // deve essere un gruppo
            if (!from.endsWith("@g.us")) {
                return await sock.sendMessage(from, { text: "Questo comando funziona solo nei gruppi!" });
            }

            // ottieni info gruppo
            const metadata = await sock.groupMetadata(from);
            const members = metadata.participants.map(p => p.id);

            if (members.length === 0) {
                return await sock.sendMessage(from, { text: "Non ho trovato utenti nel gruppo." });
            }

            // scegli casuale
            const randomUser = members[Math.floor(Math.random() * members.length)];

            const frasi = [
                "🎯 La roulette del ban ha parlato!",
                "🔫 Ops... qualcuno è stato estratto!",
                "🎲 La sorte ha deciso!",
                "💣 BOOM! È stato scelto!",
            ];

            const frase = frasi[Math.floor(Math.random() * frasi.length)];

            await sock.sendMessage(from, {
                text: `${frase}\n\nIl prescelto è 👉 @${randomUser.split("@")[0]}`,
                mentions: [randomUser]
            });

        } catch (err) {
            console.error("Errore in rsban:", err);
            await sock.sendMessage(msg.key.remoteJid, { text: "Si è verificato un errore nel comando." });
        }
    }
};
