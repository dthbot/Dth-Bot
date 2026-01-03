let handler = async (m, { conn, participants }) => {
    // 1. Controllo Gruppo
    if (!m.isGroup) return m.reply('❌ Questo comando funziona solo nei gruppi.');

    try {
        // 2. Selezione Utente (Blindata)
        // Usa ?. per evitare crash se conn.user è undefined
        const botId = conn.user?.jid || conn.user?.id;
        const users = participants.map(u => u.id).filter(id => id !== botId);
        
        if (!users || users.length === 0) return m.reply('⚠️ Non ci sono abbastanza utenti da analizzare.');

        const target = users[Math.floor(Math.random() * users.length)];
        
        // 3. Recupero Foto Profilo
        let pfp;
        try {
            pfp = await conn.profilePictureUrl(target, 'image');
        } catch {
            pfp = 'https://i.ibb.co/mS6zYfJ/no-pfp.jpg'; 
        }

        // 4. Calcolo Statistiche
        const mogLevel = Math.floor(Math.random() * 101);
        
        let status, color, verdict, emoji, audioUrl;
        
        if (mogLevel > 50) {
            status = 'MOGGER';
            color = '00FF00'; // Verde
            verdict = 'VERDETTO: MOGGER SUPREMO 🗿';
            emoji = '🤫🧏‍♂️';
            // Link audio "Mission Passed" (funzionante)
            audioUrl = 'https://www.myinstants.com/media/sounds/gta-san-andreas-mission-passed-sound.mp3';
        } else {
            status = 'MOGGET';
            color = 'FF0000'; // Rosso
            verdict = 'VERDETTO: MOGGET (WASTED) 💀';
            emoji = '📉';
            // Link audio "Wasted" (funzionante)
            audioUrl = 'https://www.myinstants.com/media/sounds/gta-v-wasted-sound-effect.mp3';
        }

        // 5. Generazione Immagine
        const gtaImage = `https://api.memegen.link/images/custom/_/${status}.png?background=${encodeURIComponent(pfp)}&font=impact&color=%23${color}&size=100`;

        // 6. Costruzione Testo
        let caption = `🔍 *SCANSIONE FACCIALE GTA EDITION* 🔍\n\n`;
        caption += `👤 *Soggetto:* @${target.split('@')[0]}\n`;
        caption += `📊 *Mog Level:* ${mogLevel}%\n`;
        caption += `🏆 *${verdict}* ${emoji}\n\n`;
        caption += `_Analisi completata._`;

        // 7. Tentativo di invio (Con gestione errore immagine)
        try {
            // Prova a inviare l'immagine GTA
            await conn.sendMessage(m.chat, {
                image: { url: gtaImage },
                caption: caption,
                mentions: [target]
            }, { quoted: m });
        } catch (imgError) {
            // SE FALLISCE (API down o url troppo lungo), invia la foto normale
            console.log("Errore API Memegen, uso fallback:", imgError);
            await conn.sendMessage(m.chat, {
                image: { url: pfp }, // Usa la foto originale
                caption: caption + "\n_(Grafica GTA non disponibile, mostro foto originale)_",
                mentions: [target]
            }, { quoted: m });
        }

        // 8. Invio Audio (Opzionale - se vuoi la musica)
        // Usa try/catch anche qui per evitare blocchi
        try {
            if (audioUrl) {
                await conn.sendMessage(m.chat, { 
                    audio: { url: audioUrl }, 
                    mimetype: 'audio/mp4', 
                    ptt: true // Manda come nota vocale
                }, { quoted: m });
            }
        } catch (e) {
            console.log("Impossibile inviare audio");
        }

        // Reazione finale
        if (m.react) await m.react(mogLevel > 50 ? '🗿' : '💀');

    } catch (error) {
        console.error(error);
        m.reply(`⚠️ Errore imprevisto: ${error.message}`);
    }
};

handler.help = ['mogger'];
handler.tags = ['fun'];
handler.command = /^(mogger|mogget)$/i;
handler.group = true;

export default handler;
