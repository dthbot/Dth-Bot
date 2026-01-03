let handler = async (m, { conn, participants }) => {
    // 1. Controllo se è un gruppo
    if (!m.isGroup) return m.reply('❌ Questo comando funziona solo nei gruppi.');

    try {
        // 2. Selezione UTENTE RANDOM (Logica 104)
        // Estraiamo tutti i partecipanti e filtriamo il bot per evitare che si auto-tagghi
        const botId = conn.user.jid || conn.user.id;
        const users = participants.map(u => u.id).filter(id => id !== botId);
        
        if (users.length === 0) return m.reply('Errore: Nessun utente trovato.');

        // Scelta casuale
        const target = users[Math.floor(Math.random() * users.length)];
        
        // 3. Recupero Foto Profilo (PFP)
        let pfp;
        try {
            pfp = await conn.profilePictureUrl(target, 'image');
        } catch {
            // Se non ha la PFP, usiamo un'immagine neutra
            pfp = 'https://i.ibb.co/mS6zYfJ/no-pfp.jpg'; 
        }

        // 4. Calcolo Mog Level (0-100)
        const mogLevel = Math.floor(Math.random() * 101);
        
        let status, color, verdict, emoji;
        
        if (mogLevel > 50) {
            status = 'MOGGER';
            color = '00FF00'; // Verde brillante (Hex senza # per l'API)
            verdict = 'VERDETTO: MOGGER SUPREMO 🗿';
            emoji = '🤫🧏‍♂️';
        } else {
            status = 'MOGGET';
            color = 'FF0000'; // Rosso brillante
            verdict = 'VERDETTO: MOGGET (WASTED) 💀';
            emoji = '📉';
        }

        // 5. Creazione URL Immagine con testo (Stile GTA)
        // Utilizziamo l'API memegen per sovrapporre il testo colorato
        const gtaImage = `https://api.memegen.link/images/custom/_/${status}.png?background=${encodeURIComponent(pfp)}&font=impact&color=%23${color}&size=100`;

        // 6. Messaggio finale
        let caption = `🔍 *SCANSIONE FACCIALE GTA EDITION* 🔍\n\n`;
        caption += `👤 *Soggetto:* @${target.split('@')[0]}\n`;
        caption += `📊 *Mog Level:* ${mogLevel}%\n`;
        caption += `🏆 *${verdict}* ${emoji}\n\n`;
        caption += `_Analisi completata. Bye bye..._`;

        // 7. Invio
        await conn.sendMessage(m.chat, {
            image: { url: gtaImage },
            caption: caption,
            mentions: [target]
        }, { quoted: m });

        // Reazione tattica
        if (m.react) await m.react(mogLevel > 50 ? '🗿' : '💀');

    } catch (error) {
        console.error(error);
        m.reply('⚠️ [SISTEMA]: Errore critico durante l\'analisi del frame.');
    }
};

handler.help = ['mogger'];
handler.tags = ['fun'];
handler.command = /^(mogger|mogget)$/i;
handler.group = true;

export default handler;
