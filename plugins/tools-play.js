import fetch from 'node-fetch';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const query = text.trim();

    if (!query) {
        throw `*Esempio:* ${usedPrefix + command} sigla dragon ball super`;
    }

    try {
        // 1. Ricerca Video (Uso un'API più stabile per evitare il blocco di YouTube)
        const searchRes = await fetch(`https://api.lolihumii.my.id/api/ytsearch?query=${encodeURIComponent(query)}`);
        const searchData = await searchRes.json();

        if (!searchData.result || searchData.result.length === 0) {
            throw 'Nessun risultato trovato.';
        }

        const results = searchData.result.slice(0, 5);

        // 2. Crea il messaggio (Solo Nomi, Niente Link)
        let message = `🎵 *Risultati per:* ${query}\n\n`;
        results.forEach((video, index) => {
            message += `*${index + 1}.* ${video.title}\n`;
            message += `   ⏱️ Durata: ${video.duration}\n\n`;
        });

        message += `✍️ *Rispondi a questo messaggio con il numero (1-5)*`;

        await conn.reply(m.chat, message, m);

        // 3. Aspetta la risposta dell'utente
        const response = await conn.waitForMessage(m.chat, 60000);

        if (!response || !response.text) return;

        const choice = parseInt(response.text.trim());
        if (isNaN(choice) || choice < 1 || choice > results.length) {
            throw 'Scelta non valida.';
        }

        const selectedVideo = results[choice - 1];
        
        // Avvisa l'utente
        await conn.reply(m.chat, `⏳ Scarico l'audio di:\n*${selectedVideo.title}*`, m);

        // 4. Download Audio (Convertitore esterno per bypassare le restrizioni di YT)
        const dlRes = await fetch(`https://api.lolihumii.my.id/api/ytaudio?url=${encodeURIComponent(selectedVideo.link)}`);
        const dlData = await dlRes.json();
        
        const audioUrl = dlData.result.link || dlData.result;
        if (!audioUrl) throw 'Errore durante il recupero del file audio.';

        // 5. Gestione File Temporaneo
        const tmpDir = join(process.cwd(), 'tmp');
        if (!existsSync(tmpDir)) mkdirSync(tmpDir);
        
        const fileName = `${Date.now()}.mp3`;
        const filePath = join(tmpDir, fileName);

        // Download effettivo dello stream
        const fileFetch = await fetch(audioUrl);
        const fileStream = createWriteStream(filePath);
        
        await new Promise((resolve, reject) => {
            fileFetch.body.pipe(fileStream);
            fileFetch.body.on('error', reject);
            fileStream.on('finish', resolve);
        });

        // 6. Invio File
        await conn.sendFile(m.chat, filePath, `${selectedVideo.title}.mp3`, '', m, false, { 
            mimetype: 'audio/mpeg',
            asDocument: false // Inviato come nota audio riproducibile
        });

        // 7. Pulizia immediata
        unlinkSync(filePath);

    } catch (error) {
        console.error(error);
        m.reply(`❌ *Errore:* ${error.message || 'Servizio non disponibile al momento.'}`);
    }
};

handler.help = ['play <nome>'];
handler.tags = ['downloader'];
handler.command = ['play'];
handler.limit = true;

export default handler;
            
