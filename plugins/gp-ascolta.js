import ytdl from 'ytdl-core';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import yts from 'yt-search';

let handler = async (m, { conn, text }) => {
    if (!text) throw '📌 Scrivi il nome della canzone da ascoltare, es: .ascolta Shape of You';

    // Cerca video su YouTube
    let result = await yts(text);
    if (!result || !result.videos.length) throw '❌ Nessuna canzone trovata';
    let video = result.videos[0];

    let tempPath = `./temp/${video.videoId}.ogg`;
    
    // Scarica e converte in vocale
    await new Promise((resolve, reject) => {
        let stream = ytdl(video.url, { filter: 'audioonly', quality: 'highestaudio' });
        ffmpeg(stream)
            .audioCodec('libopus')
            .format('ogg')
            .save(tempPath)
            .on('end', resolve)
            .on('error', reject);
    });

    // Testo didascalia
    let caption = `🎵 ${video.title}\n⏱ Durata: ${video.timestamp}\n🔗 ${video.url}`;

    // Invia vocale come nota vocale
    await conn.sendMessage(m.chat, { 
        audio: fs.readFileSync(tempPath), 
        mimetype: 'audio/ogg', 
        ptt: true, 
        fileName: `${video.title}.ogg`,
        contextInfo: { externalAdReply: { mediaUrl: video.url, mediaType: 2, title: video.title } }
    }, { quoted: m });

    // Cancella file temporaneo
    fs.unlinkSync(tempPath);
}

handler.command = /^ascolta$/i;
export default handler;
