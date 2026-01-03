// Plugin .104 per bot WhatsApp
// Estrae un utente a caso e assegna una percentuale di "invalidità"

let handler = async (m, { conn, participants, usedPrefix, command }) => {
    // 1. Controllo se è un gruppo (ridondante se usi handler.group = true, ma sicuro)
    if (!m.isGroup) return m.reply('❌ Questo comando funziona solo nei gruppi.');

    try {
        // 2. Filtra i partecipanti per evitare di taggare il bot stesso (opzionale)
        const botId = conn.user.jid || conn.user.id;
        const users = participants.map(u => u.id).filter(id => id !== botId);
        
        if (users.length === 0) return m.reply('Non ci sono abbastanza utenti qui.');

        // 3. Selezione casuale dell'utente
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        // 4. Genera percentuale casuale (0-104%)
        const percentuale = Math.floor(Math.random() * 105); 
        
        // 5. Database Meme (Link diretti a immagini)
        const memeLinks = [
            'https://i.imgflip.com/4/30b1gx.jpg',
            'https://api.memegen.link/images/custom/_/CERTIFICATO_104.png?background=https://i.ibb.co/L5hS0tF/legge104-meme1.jpg'
        ];
        const randomMeme = memeLinks[Math.floor(Math.random() * memeLinks.length)];

        // 6. Logica della diagnosi
        let diagnosi = '';
        if (percentuale < 20) diagnosi = "Sta bene, è solo un po' stanco.";
        else if (percentuale < 50) diagnosi = "Sintomi lievi, inizia a dimenticare le chiavi di casa.";
        else if (percentuale < 80) diagnosi = "La situazione è critica, parcheggio giallo riservato.";
        else if (percentuale <= 100) diagnosi = "INVALIDITÀ TOTALE: Ha diritto alla sedia a rotelle truccata.";
        else diagnosi = "LIVELLO DIO: 104% Superato. È ufficialmente il presidente dell'INPS. ♿";

        // 7. Costruzione del messaggio
        const caption = `🚨 *CONTROLLO INVALIDITÀ (Legge 104)* 🚨\n\n` +
                        `👤 *Paziente:* @${randomUser.split('@')[0]}\n` +
                        `📊 *Grado:* ${percentuale}%\n` +
                        `📝 *Esito:* ${diagnosi}`;

        // 8. Invio con immagine, didascalia e tag attivo
        await conn.sendMessage(m.chat, {
            image: { url: randomMeme },
            caption: caption,
            mentions: [randomUser]
        }, { quoted: m });

        // Feedback visivo
        if (m.react) await m.react('♿');

    } catch (e) {
        console.error(e);
        m.reply('⚠️ Errore durante la visita medica.');
    }
}

handler.help = ['104'];
handler.tags = ['fun'];
handler.command = /^(104|invalidita)$/i; // Risponde a .104 o .invalidita
handler.group = true; // Impedisce l'uso in chat privata

export default handler;
