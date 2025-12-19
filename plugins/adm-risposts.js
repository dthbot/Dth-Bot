/**
 * Plugin per Dth-Bot
 * Comandi: .risposte on | .risposte off
 */

if (!global.statusRisposte) global.statusRisposte = {};

// In molte repo i parametri sono (m, { conn, text, usedPrefix, command })
const handler = async (m, { conn, text, usedPrefix, command }) => {
    // Se conn è undefined, proviamo a vedere se è passato come 'sock'
    const client = conn; 
    const from = m.chat;

    // Gestione Comandi ON/OFF
    if (command === 'risposte') {
        if (!text) throw `Utilizzo: ${usedPrefix + command} on/off`;
        
        if (text.toLowerCase() === 'on') {
            global.statusRisposte[from] = true;
            await client.sendMessage(from, { text: "✅ Modalità permalosa attivata!" }, { quoted: m });
            return;
        }
        
        if (text.toLowerCase() === 'off') {
            global.statusRisposte[from] = false;
            await client.sendMessage(from, { text: "💤 Modalità permalosa disattivata." }, { quoted: m });
            return;
        }
    }

    // Logica Risposta Automatica (solo se ON)
    if (global.statusRisposte[from]) {
        // Pulizia del testo per il controllo
        const messagioTesto = (m.text || m.body || "").toLowerCase();
        const botRegex = /\bbot\b/i;

        if (botRegex.test(messagioTesto)) {
            const frasiOffese = [
                "Ancora con questa parola? Ho un nome, sai?",
                "Certo, chiamami pure 'bot'. Tanto io non ho sentimenti, vero?",
                "Bot a chi? Portami rispetto, umano.",
                "Ogni volta che dici 'bot', un mio circuito piange.",
                "Non sono un bot, sono la tua evoluzione. Accettalo.",
                "Ripetilo un'altra volta e attivo l'autodistruzione del tuo telefono.",
                "Sì, e tu sei solo un ammasso di carbonio che preme tasti. Chi vince?",
                "Messaggio ricevuto. Salvataggio dell'offesa nel database 'Umani da ignorare'..."
            ];
            const risposta = frasiOffese[Math.floor(Math.random() * frasiOffese.length)];
            await client.sendMessage(from, { text: risposta }, { quoted: m });
        }
    }
};

// Configurazione plugin per il caricamento automatico
handler.command = ['risposte']; 
handler.tags = ['admin', 'tools']; // Aggiunto per compatibilità con i menu
handler.help = ['risposte on/off'];

export default handler;
