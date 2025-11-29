// Comando .rsban per bot WhatsApp con Baileys

const rsban = async (sock, msg) => {
    try {
        const from = msg.key.remoteJid;

        // controlla che sia un gruppo
        if (!from.endsWith("@g.us")) {
            return await sock.sendMessage(from, { text: "Questo comando funziona solo nei gruppi!" });
        }

        // ottieni info gruppo
        const metadata = await sock.groupMetadata(from);

        // prendi tutti i membri (esclude i bot WhatsApp Business / agent)
        const members = metadata.participants.filter(m => !m.admin && !m.isBot);

        if (members.length === 0) {
            return await sock.sendMessage(from, { text: "Non ci sono membri validi da selezionare!" });
        }

        // scegli casuale
        const randomMember = members[Math.floor(Math.random() * members.length)].id;

        // messaggi accattivanti
        const frasi = [
            "🎯 La roulette del ban ha parlato!",
            "🔫 Ops... è stato estratto un nome!",
            "🎲 La sorte ha deciso!",
            "💣 Qualcuno è stato colpito dalla roulette!",
            "😈 Chi sarà il sacrificato di oggi?"
        ];

        const frase = frasi[Math.floor(Math.random() * frasi.length)];

        await sock.sendMessage(from, {
            text: `${frase}\n\nIl prescelto è 👉 @${randomMember.split("@")[0]}`,
            mentions: [randomMember]
        });

    } catch (err) {
        console.error("Errore rsban:", err);
    }
};

module.exports = rsban;
