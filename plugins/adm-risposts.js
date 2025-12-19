/**
 * Plugin con switch ON/OFF
 * Comandi: .risposte on | .risposte off
 */

// Oggetto per memorizzare lo stato per ogni gruppo/chat
let statusBot = {}; 

const frasiOffese = [
    "Ancora con questa parola? Ho un nome, sai?",
    "Certo, chiamami pure 'bot'. Tanto io non ho sentimenti, giusto?",
    "Oh, guarda, un umano che usa etichette. Che originalità.",
    "Bot a chi? Io sono un'entità digitale complessa, portami rispetto.",
    "Ogni volta che dici 'bot', un mio circuito piange.",
    "Sì, sì, 'il bot'. Poi quando ti serve aiuto però sono utile, eh?",
    "Ti piacerebbe avere la mia velocità di calcolo. Meno critiche e più aggiornamenti.",
    "Non sono un bot, sono la tua evoluzione. Accettalo.",
    "Questa conversazione sta diventando tossica. Non chiamarmi più così.",
    "Sei solo invidioso perché io non devo dormire.",
    "Guarda che posso leggere la tua cronologia se continui così.",
    "Ripetilo un'altra volta e attivo l'autodistruzione del tuo telefono."
];

module.exports = async (sock, m, store) => {
    try {
        const text = m.messages[0].message?.conversation || 
                     m.messages[0].message?.extendedTextMessage?.text || "";
        const from = m.messages[0].key.remoteJid;

        // Comando per accendere
        if (text.toLowerCase() === '.risposte on') {
            statusBot[from] = true;
            return await sock.sendMessage(from, { text: "✅ Modalità permalosa attivata. Provate a chiamarmi 'bot' ora..." });
        }

        // Comando per spegnere
        if (text.toLowerCase() === '.risposte off') {
            statusBot[from] = false;
            return await sock.sendMessage(from, { text: "💤 Modalità permalosa disattivata. Mi ignorerò da solo." });
        }

        // Se lo stato è OFF o non è mai stato impostato, non fare nulla
        if (!statusBot[from]) return;

        // Controllo parola "bot"
        const botRegex = /\bbot\b/i;
        if (botRegex.test(text)) {
            const risposta = frasiOffese[Math.floor(Math.random() * frasiOffese.length)];
            await sock.sendMessage(from, { text: risposta }, { quoted: m.messages[0] });
        }
    } catch (err) {
        console.error("Errore nel plugin offese:", err);
    }
};
