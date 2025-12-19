/**
 * Plugin per Dth-Bot / ChatUnity
 * Gestisce risposte automatiche e comandi ON/OFF
 */

// Usiamo una variabile globale fuori dall'handler
if (!global.statusRisposte) global.statusRisposte = {};

const handler = async (m, { sock, text, command, usedPrefix }) => {
    const from = m.key.remoteJid;

    // Gestione Comandi ON/OFF
    if (command === 'risposte') {
        if (!text) return sock.sendMessage(from, { text: `Utilizzo: ${usedPrefix + command} on/off` }, { quoted: m });
        
        if (text.toLowerCase() === 'on') {
            global.statusRisposte[from] = true;
            return sock.sendMessage(from, { text: "✅ Modalità permalosa attivata!" }, { quoted: m });
        }
        
        if (text.toLowerCase() === 'off') {
            global.statusRisposte[from] = false;
            return sock.sendMessage(from, { text: "💤 Modalità permalosa disattivata." }, { quoted: m });
        }
    }

    // Logica Risposta Automatica (solo se ON)
    if (global.statusRisposte[from]) {
        const messagioTesto = (m.message?.conversation || m.message?.extendedTextMessage?.text || "").toLowerCase();
        const botRegex = /\bbot\b/i;

        if (botRegex.test(messagioTesto)) {
            const frasiOffese = [
                "Ancora con questa parola? Ho un nome, sai?",
                "Certo, chiamami pure 'bot'. Tanto io non ho sentimenti, vero?",
                "Bot a chi? Portami rispetto, umano.",
                "Ogni volta che dici 'bot', un mio circuito piange.",
                "Non sono un bot, sono la tua evoluzione. Accettalo.",
                "Ripetilo un'altra volta e attivo l'autodistruzione del tuo telefono."
            ];
            const risposta = frasiOffese[Math.floor(Math.random() * frasiOffese.length)];
            await sock.sendMessage(from, { text: risposta }, { quoted: m });
        }
    }
};

// Questi sono i parametri che di solito ChatUnity/Dth-Bot leggono per registrare il plugin
handler.command = ['risposte']; // Il comando principale
handler.customPrefix = ['.'];    // Prefisso
handler.exp = 0;                // Esempio di metadato comune

export default handler;
