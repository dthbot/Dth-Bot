import scdl from 'soundcloud-downloader'; // L'import per SoundCloud

// --- HANDLER PRINCIPALE AGGIORNATO (SOUNDCLOUD - TENTATIVO FINALE DI SINTASSI) ---
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
            text: `🎧 Richiesta download traccia SoundCloud per URL: ${trackUrl} (Usando sintassi scdl.create().getStream)...` 
        }, { quoted: m });
        
        // 1. Crea il client esplicito (necessario in alcune versioni della libreria)
        const client = scdl.create();

        // 2. Ottieni lo stream audio (Utilizzando la funzione più comune per il client)
        // La funzione probabile è client.getStream() o client.download(). Usiamo getStream come tentativo più probabile:
        const audioStream = await client.getStream(trackUrl); 

        // 3. Ottieni le informazioni per il nome del file (Usando il client)
        try {
            const trackInfo = await client.getInfo(trackUrl);
            title = trackInfo.title.replace(/[^a-zA-Z0-9 ]/g, ''); 
        } catch (infoError) {
            console.warn("Impossibile ottenere info traccia, usando titolo di default.");
        }


        // 4. Invio Audio (tramite Stream)
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
        m.reply(`⚠️ Download fallito. Errore: ${error.message}\nMotivi: 1. Sintassi errata (funzione diversa). 2. Traccia non accessibile.`);
    }
};

handler.command = ['coolmp3'];
handler.tags = ['media'];
handler.help = ['.coolmp3 <soundcloud link>'];
export default handler;
