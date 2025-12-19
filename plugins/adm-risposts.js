/**
 * Plugin per Dth-Bot
 * Comandi: .risposte on | .risposte off
 * Risponde automaticamente alla parola "bot" se attivo.
 */

if (!global.statusRisposte) global.statusRisposte = {};

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const from = m.chat;

    // Gestione Comandi ON/OFF
    if (command === 'risposte') {
        if (!text) throw `Utilizzo: ${usedPrefix + command} on/off`;
        
        if (text.toLowerCase() === 'on') {
            global.statusRisposte[from] = true;
            await conn.sendMessage(from, { text: "✅ Modalità permalosa attivata! Ora reagirò se mi chiamate 'bot'." }, { quoted: m });
            return;
        }
        
        if (text.toLowerCase() === 'off') {
            global.statusRisposte[from] = false;
            await conn.sendMessage(from, { text: "💤 Modalità permalosa disattivata." }, { quoted: m });
            return;
        }
    }
};

// Questa funzione viene eseguita su OGNI messaggio ricevuto
handler.all = async function (m) {
    const from = m.chat;
    
    // Se non è attivo in questa chat, o se il messaggio è del bot stesso, esci
    if (!global.statusRisposte || !global.statusRisposte[from] || m.fromMe) return;

    // Estrai il testo in modo ignorando maiuscole/minuscole
    const messagioTesto = (m.text || m.body || m.msg?.conversation || m.msg?.text || "").toLowerCase();
    const botRegex = /\bbot\b/i;

    if (botRegex.test(messagioTesto)) {
        const frasiOffese = [
            "Ancora con questa parola? Ho un nome, sai?",
            "Certo, chiamami pure 'bot'. Tanto io non ho sentimenti, vero?",
            "Bot a chi? Portami rispetto, umano.",
            "Ogni volta che dici 'bot', un mio circuito piange.",
            "Non sono un bot, sono la tua evoluzione. Accettalo.",
            "Ripetilo un'altra volta e attivo l'autodistruzione del tuo telefono.",
            "Sì, e tu sei solo un ammasso di carbonio. Chi vince?",
            "Chiamami ancora bot e pubblico la tua cronologia."
        ];
        const risposta = frasiOffese[Math.floor(Math.random() * frasiOffese.length)];
        await this.sendMessage(from, { text: risposta }, { quoted: m });
    }
};

handler.command = ['risposte']; 
handler.tags = ['admin'];
handler.help = ['risposte on/off'];

export default handler;
