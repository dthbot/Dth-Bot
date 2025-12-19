/**
 * Plugin per ChatUnity (ES Module)
 * Comandi: .risposte on | .risposte off
 */

// Usiamo una variabile globale per mantenere lo stato tra i messaggi
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

const handler = async (sock, m, store) => {
    try {
        // Estrazione testo dal messaggio
        const text = m.messages[0].message?.conversation || 
                     m.messages[0].message?.extendedTextMessage?.text || "";
        const from = m.messages[0].key.remoteJid;

        // Comando per attivare
        if (text.toLowerCase() === '.risposte on') {
            statusBot[from] = true;
            return await sock.sendMessage(from, { text: "✅ Modalità permalosa attivata. Provate a chiamarmi 'bot' ora..." });
        }

        // Comando per disattivare
        if (text.toLowerCase() === '.risposte off') {
            statusBot[from] = false;
            return await sock.sendMessage(from, { text: "💤 Modalità permalosa disattivata." });
        }

        // Se lo stato è OFF, non procedere
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

export default handler;
