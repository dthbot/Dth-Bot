import fetch from 'node-fetch';
import { createWriteStream, existsSync, mkdirSync } from 'fs'; // Aggiunto check cartella
import { join } from 'path';

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
    const query = text.trim();

    if (!query) {
        throw `*Esempio:* ${usedPrefix + command} sigla dragon ball super`;
    }

    try {
        // Ricerca su YouTube
        // Nota: Le API pubbliche gratuite cambiano spesso.
        const ytSearch = await fetch(`https://api.akuari.my.id/search/youtube?query=${encodeURIComponent(query)}`);
        const ytData = await ytSearch.json();

        if (!ytData.result || ytData.result.length === 0) {
            throw 'Nessun risultato trovato su YouTube.';
        }

        // Prendi i primi 5 risultati
        const results = ytData.result.slice(0, 5);

        // Crea il messaggio con le opzioni
        let message = `🎵 *Risultati per:* ${query}\n\n`;
        results.forEach((video, index) => {
            message += `${index + 1}. ${video.title}\n`;
            message += `   Durata: ${video.duration}\n`;
            message += `   Canale: ${video.channel}\n\n`;
        });

        message += `Scegli un numero da 1 a ${results.length} per scaricare.`;

        // Invia il messaggio con le opzioni
        // Assicuriamoci di passare 'm' per quotare il messaggio
        await conn.reply(m.chat, message, m);

        // ⚠️ PUNTO CRITICO: waitForMessage non è standard in tutte le basi
        // Verifica se il tuo bot supporta questa funzione
        const response = await conn.waitForMessage(m.chat, 60000); // 60 secondi di timeout

        if (!response || !response.text) {
            throw 'Tempo scaduto. Riprova.';
        }

        const choice = parseInt(response.text.trim());

        if (isNaN(choice) || choice < 1 || choice > results.length) {
            throw 'Scelta non valida. Scegli un numero tra 1 e ' + results.length + '.';
        }

        const selectedVideo = results[choice - 1];
        const videoUrl = selectedVideo.link;

        await conn.reply(m.chat, `_Scarico l'audio: ${selectedVideo.title}..._`, m);

        // Scarica il video come MP3
        const ytdlUrl = `https://api.akuari.my.id/downloader/youtube?link=${encodeURIComponent(videoUrl)}`;
        const dlData = await fetch(ytdlUrl);
        const dlJson = await dlData.json();

        // A volte le API restituiscono il link in 'mp3', a volte in 'link' o 'url'
        const mp3Url = dlJson.mp3 || dlJson.link;

        if (!mp3Url) {
            throw 'Errore durante il recupero del link di download.';
        }

        const fileName = `temp_${Date.now()}.mp3`;
        // Verifica esistenza cartella tmp
        const tmpDir = join(process.cwd(), 'tmp');
        if (!existsSync(tmpDir)) mkdirSync(tmpDir);
        
        const filePath = join(tmpDir, fileName);

        // Scarica il file MP3
        const responseStream = await fetch(mp3Url);
        const fileStream = createWriteStream(filePath);
        await new Promise((resolve, reject) => {
            responseStream.body.pipe(fileStream);
            responseStream.body.on('error', reject);
            fileStream.on('finish', resolve);
        });

        // Invia il file MP3
        await conn.sendFile(m.chat, filePath, fileName, null, m, false, { 
            asDocument: false, // Meglio false per inviarlo come audio riproducibile
            mimetype: 'audio/mpeg' 
        });

        // Pulizia file temporaneo
        setTimeout(() => {
            try {
                require('fs').unlinkSync(filePath);
            } catch (e) {
                console.error('Errore durante la pulizia del file:', e);
            }
        }, 5000);

    } catch (error) {
        console.error(error);
        throw error.toString() || 'Errore durante l\'elaborazione della richiesta.';
    }
};

handler.help = ['play <query>'];
handler.tags = ['downloader'];
handler.command = ['play'];
handler.limit = true;

export default handler;
          
