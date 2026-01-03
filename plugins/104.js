// Plugin: .104 (Tagga un utente a caso e assegna una percentuale di 104)
// Funzionamento: Estrae un partecipante, genera un numero casuale e invia un meme.

export default async function handler(m, { conn, participants }) {
    // 1. Controlla se siamo in un gruppo
    if (!m.isGroup) return m.reply('❌ Questo comando può essere usato solo nei gruppi.');

    // 2. Seleziona un utente a caso (escludendo il bot stesso se possibile)
    const users = participants.map(u => u.id);
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    // 3. Genera una percentuale casuale
    const percentuale = Math.floor(Math.random() * 101); // Da 0 a 100
    
    // 4. Lista di immagini meme (Sostituisci i link con quelli che preferisci)
    const memeLinks = [
        'https://i.ibb.co/L5hS0tF/legge104-meme1.jpg',
        'https://i.ibb.co/vYmC0z4/legge104-meme2.jpg',
        'https://api.memegen.link/images/custom/_/CERTIFICATO_104.png?background=https://i.imgflip.com/4/30b1gx.jpg'
    ];
    const randomMeme = memeLinks[Math.floor(Math.random() * memeLinks.length)];

    // 5. Messaggi in base alla percentuale
    let diagnosi = '';
    if (percentuale < 20) diagnosi = "Sta bene, è solo un po' pigro.";
    else if (percentuale < 50) diagnosi = "Sintomi lievi, serve una visita dall'INPS.";
    else if (percentuale < 80) diagnosi = "La situazione è grave, parcheggio riservato immediato.";
    else diagnosi = "LIVELLO MASSIMO: Può guidare la sedia a rotelle in autostrada. ♿";

    // 6. Testo del messaggio
    const caption = `🚨 *CONTROLLO INVALIDITÀ (Legge 104)* 🚨\n\n` +
                    `👤 *Paziente:* @${randomUser.split('@')[0]}\n` +
                    `📊 *Livello di sofferenza:* ${percentuale}%\n` +
                    `📝 *Diagnosi:* ${diagnosi}`;

    // 7. Invio del messaggio con immagine e tag
    await conn.sendMessage(m.chat, {
        image: { url: randomMeme },
        caption: caption,
        mentions: [randomUser]
    }, { quoted: m });
}

// Configurazione comando
handler.help = ['104'];
handler.tags = ['fun'];
handler.command = ['104'];
handler.group = true; // Solo gruppi

// export default handler; // Se usi il sistema a caricamento automatico
      
