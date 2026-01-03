import fetch from 'node-fetch';

let handler = async (m, { conn, participants }) => {
    // 1. Controllo Gruppo
    if (!m.isGroup) return m.reply('❌ Questo comando funziona solo nei gruppi.');

    try {
        // 2. Selezione Utente (Anti-Crash)
        const botId = conn.user?.jid || conn.user?.id;
        // Filtra bot e utenti non validi
        const users = participants.map(u => u.id).filter(id => id && id !== botId);
        
        if (!users || users.length === 0) return m.reply('⚠️ Non ci sono abbastanza utenti.');

        const target = users[Math.floor(Math.random() * users.length)];
        
        // 3. Recupero Foto Profilo (PFP)
        let pfp;
        try {
            pfp = await conn.profilePictureUrl(target, 'image');
        } catch {
            pfp = 'https://i.ibb.co/mS6zYfJ/no-pfp.jpg'; 
        }

        // 4. Calcolo Statistiche
        const mogLevel = Math.floor(Math.random() * 101);
        
        let status, color, verdict, emoji, audioUrl;
        
        // Link audio hostati su GitHub (più stabili di myinstants)
        if (mogLevel > 50) {
            status = 'MOGGER';
            color = '00FF00'; // Verde
            verdict = 'VERDETTO: MOGGER SUPREMO 🗿';
            emoji = '🤫🧏‍♂️';
            audioUrl = 'https://github.com/Quiec/WhatsApp-Bot/raw/master/media/mission_passed.mp3'; 
        } else {
            status = 'MOGGET';
            color = 'FF0000'; // Rosso
            verdict = 'VERDETTO: MOGGET (WASTED) 💀';
            emoji = '📉';
            audioUrl = 'https://github.com/Quiec/WhatsApp-Bot/raw/master/media/wasted.mp3';
        }

        // 5. Preparazione Testo
        let caption = `🔍 *SCANSIONE FACCIALE GTA* 🔍\n\n`;
        caption += `👤 *Soggetto:* @${target.split('@')[0]}\n`;
        caption += `📊 *Mog Level:* ${mogLevel}%\n`;
        caption += `🏆 *${verdict}* ${emoji}\n\n`;
        caption += `_Analisi completata._`;

        // 6. TENTATIVO INVIO IMMAGINE (Gestione Fallback 404)
        let imageSent = false;
        
        // Tentativo A: Immagine GTA
        try {
            const gtaUrl = `https://api.memegen.link/images/custom/_/${status}.png?background=${encodeURIComponent(pfp)}&font=impact&color=%23${color}&size=100`;
            
            // Verifichiamo prima se il link esiste davvero (evita il crash 404)
            const check = await fetch(gtaUrl);
            if (check.status !== 200) throw new Error("Memegen Error");

            await conn.sendMessage(m.chat, {
                image: { url: gtaUrl },
                caption: caption,
                mentions: [target]
            }, { quoted: m });
            imageSent = true;
        } catch (e) {
            // Se fallisce, non fare nulla qui, passiamo al fallback
            console.log("Mogger GTA Image Failed, switching to fallback.");
        }

        // Tentativo B: Foto Normale (Se Tentativo A fallisce)
        if (!imageSent) {
            await conn.sendMessage(m.chat, {
                image: { url: pfp },
                caption: caption + "\n_(Grafica GTA non disp., uso foto originale)_",
                mentions: [target]
            }, { quoted: m });
        }

        // 7. INVIO AUDIO (Separato per sicurezza)
        try {
            await conn.sendMessage(m.chat, { 
                audio: { url: audioUrl }, 
                mimetype: 'audio/mp4', 
                ptt: true 
            }, { quoted: m });
        } catch (e) {
            console.log("Audio non inviato (errore link o formato)");
        }

        // Reazione finale
        if (m.react) await m.react(mogLevel > 50 ? '🗿' : '💀');

    } catch (error) {
        console.error(error);
        m.reply('⚠️ Errore generico nel comando.');
    }
};

handler.help = ['mogger'];
handler.tags = ['fun'];
handler.command = /^(mogger|mogget)$/i;
handler.group = true;

export default handler;
