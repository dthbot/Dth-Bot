let handler = async (m, { conn, participants }) => {
    if (!m.isGroup) return m.reply('❌ Comando solo per gruppi.');

    try {
        // 1. Selezione utente random
        const users = participants.map(u => u.id).filter(id => id !== conn.user.jid);
        const target = users[Math.floor(Math.random() * users.length)];
        
        // 2. Recupero Foto Profilo
        let pfp;
        try {
            pfp = await conn.profilePictureUrl(target, 'image');
        } catch {
            pfp = 'https://i.ibb.co/mS6zYfJ/no-pfp.jpg'; 
        }

        // 3. Calcolo statistiche
        const mogLevel = Math.floor(Math.random() * 101);
        
        let status, color, verdict;
        if (mogLevel > 50) {
            status = 'MOGGER';
            color = 'green'; // Simile a "Mission Passed" di GTA
            verdict = '✅ Hai dominato il frame. Bye bye... 🤫🧏‍♂️';
        } else {
            status = 'MOGGET';
            color = 'red';   // Simile a "Wasted" di GTA
            verdict = '❌ Sei stato moggato brutalmente. 📉';
        }

        // 4. Creazione URL Immagine con testo (stile GTA)
        // Usiamo memegen per generare la scritta sopra la foto
        const gtaImage = `https://api.memegen.link/images/custom/_/${status}.png?background=${encodeURIComponent(pfp)}&font=impact&color=${color}&size=100`;

        // 5. Costruzione Messaggio
        let caption = `🔍 *ANALISI ESTETICA AVANZATA* 🔍\n\n`;
        caption += `👤 *Soggetto:* @${target.split('@')[0]}\n`;
        caption += `📊 *Mog Level:* ${mogLevel}%\n\n`;
        caption += `🏆 *Risultato:* ${verdict}`;

        // 6. Invio
        await conn.sendMessage(m.chat, {
            image: { url: gtaImage },
            caption: caption,
            mentions: [target]
        }, { quoted: m });

        if (m.react) await m.react(mogLevel > 50 ? '🗿' : '💀');

    } catch (e) {
        console.error(e);
        m.reply('⚠️ Errore nel caricamento dei dati genetici.');
    }
};

handler.help = ['mogger'];
handler.tags = ['fun'];
handler.command = /^(mogger|mogget)$/i;
handler.group = true;

export default handler;
