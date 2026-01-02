import fetch from 'node-fetch';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    const query = text.trim();

    if (!query) {
        throw `*Esempio:* ${usedPrefix + command} Pezzi di fango`;
    }

    try {
        // Ricerca video tramite API
        const ytSearch = await fetch(`https://api.akuari.my.id/search/youtube?query=${encodeURIComponent(query)}`);
        const ytData = await ytSearch.json();

        if (!ytData.result || ytData.result.length === 0) {
            throw 'Nessun risultato trovato.';
        }

        const results = ytData.result.slice(0, 5);

        // Costruzione messaggio senza link
        let message = `🎵 *Risultati per:* ${query}\n\n`;
        results.forEach((video, index) => {
            message += `*${index + 1}.* ${video.title}\n`;
            message += `⏱️ Durata: ${video.duration}\n\n`;
        });

        message += `Rispondi con un numero (1-${results.length}) per scaricare l'audio.`;

        await conn.reply(m.chat, message, m);

        // Attesa della scelta dell'utente
        const response = await conn.waitForMessage(m.chat, 60000);

        if (!response || !response.text) return; // Timeout silenzioso

        const choice = parseInt(response.text.trim());
        if (isNaN(choice) || choice < 1 || choice > results.length) {
            throw 'Scelta non valida. Operazione annullata.';
        }

        const selectedVideo = results[choice - 1];
        await conn.reply(m.chat, `_Sto preparando l'audio di:_ \n*${selectedVideo.title}*`, m);

        // Recupero link di download
        const dlData = await fetch(`https://api.akuari.my.id/downloader/youtube?link=${encodeURIComponent(selectedVideo.link)}`);
        const dlJson = await dlData.json();
        const mp3Url = dlJson.mp3 || dlJson.link;

        if (!mp3Url) throw 'Impossibile recuperare il file audio.';

        // Gestione file locale
        const tmpDir = join(process.cwd(), 'tmp');
        if (!existsSync(tmpDir)) mkdirSync(tmpDir);
        
        const fileName = `${Date.now()}.mp3`;
        const filePath = join(tmpDir, fileName);

        // Download effettivo
        const res = await fetch(mp3Url);
        const fileStream = createWriteStream(filePath);
        
        await new Promise((resolve, reject) => {
            res.body.pipe(fileStream);
            res.body.on('error', reject);
            fileStream.on('finish', resolve);
        });

        // Invio audio
        await conn.sendFile(m.chat, filePath, `${selectedVideo.title}.mp3`, '', m, false, { 
            mimetype: 'audio/mpeg' 
        });

        // Pulizia rapida
        unlinkSync(filePath);

    } catch (error) {
        console.error(error);
        m.reply(`❌ *Errore:* ${error.message || error}`);
    }
};

handler.help = ['play <titolo>'];
handler.tags = ['downloader'];
handler.command = ['play'];
handler.limit = true;

export default handler;
                         
