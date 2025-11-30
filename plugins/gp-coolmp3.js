import scdl from 'soundcloud-downloader'; // L'import per SoundCloud

// --- HANDLER PRINCIPALE AGGIORNATO (SOUNDCLOUD) ---
const handler = async (m, { conn, args, usedPrefix }) => {

    if (!args[0]) {
        return m.reply(`❌ Inserisci l'URL di una traccia SoundCloud.\nEsempio: *${usedPrefix}coolmp3* https://soundcloud.com/user/track-name`);
    }

    const trackUrl = args[0];
    
    // Controlla se l'URL sembra essere di SoundCloud
    if (!trackUrl.includes('soundcloud.com')) {
        return m.reply(`❌ L'URL fornito non sembra essere una traccia SoundCloud.`);
    }

    m.react('🕒');

    let title = 'Traccia-SoundCloud'; 

    try {
        await conn.sendMessage(m.chat, { 
            text: `🎧 Richiesta download traccia SoundCloud per URL: ${trackUrl} (usando soundcloud-downloader)...` 
        }, { quoted: m });
        
        // 1. Ottieni lo stream audio da SoundCloud
        // Questa funzione restituisce direttamente uno Stream
        const audioStream = await scdl.download(trackUrl);

        // 2. Ottieni le informazioni per il nome del file
        try {
            const trackInfo = await scdl.getInfo(trackUrl);
            title = trackInfo.title.replace(/[^a-zA-Z0-9 ]/g, ''); 
        } catch (infoError) {
            // Se fallisce solo la richiesta info, si usa il titolo di default
            console.warn("Impossibile ottenere info traccia, usando titolo di default.");
        }


        // 3. Invio Audio (tramite Stream)
        // La tua funzione conn.sendMessage deve accettare un oggetto Stream come input
        await conn.sendMessage(m.chat, { 
            audio: { stream: audioStream }, 
            mimetype: "audio/mpeg", 
            fileName: `${title}.mp3`
        }, { quoted: m });
        
        m.react('✅');
        await conn.reply(m.chat, `✅ *${title}* inviato! (SoundCloud download)`, m);

    } catch (error) {
        console.error("Errore nel plugin SoundCloud:", error);
        m.react('❌');
        m.reply(`⚠️ Download fallito. Errore: ${error.message}\nMotivi: 1. Traccia privata o protetta. 2. Problemi di rete in Termux.`);
    }
};

handler.command = ['coolmp3'];
handler.tags = ['media'];
handler.help = ['.coolmp3 <soundcloud link>'];
export default handler;
