import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';
import fs from 'fs';

let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('『 ❌ 』- Inserisci il nome della canzone o link YouTube.');

  try {
    // Ottieni info del video
    let info = await ytdl.getInfo(args.join(' '));
    let title = info.videoDetails.title;

    // Crea bottoni
    const buttons = [
      { buttonId: `playbtn_${info.videoDetails.videoId}`, buttonText: { displayText: '🎵 Ascolta' }, type: 1 },
      { buttonId: 'cancelbtn', buttonText: { displayText: '❌ Annulla' }, type: 1 }
    ];

    const buttonMessage = {
      text: `🎶 Trovata: *${title}*`,
      footer: 'Drak-Bot Music',
      buttons: buttons,
      headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('『 ❌ 』- Impossibile trovare la canzone.');
  }
};

// Handler per i bottoni
let buttonHandler = async (m, { conn }) => {
  if (!m.selectedButtonId) return;
  const id = m.selectedButtonId;

  if (id.startsWith('playbtn_')) {
    const videoId = id.replace('playbtn_', '');
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title;
      const tempFile = path.join(os.tmpdir(), Date.now() + '.m4a');

      // Scarica e converte in AAC / m4a compatibile iPhone
      await new Promise((resolve, reject) => {
        ffmpeg(ytdl(url, { filter: 'audioonly' }))
          .audioCodec('aac')
          .audioBitrate(128)
          .format('ipod') // crea .m4a
          .save(tempFile)
          .on('end', resolve)
          .on('error', reject);
      });

      // Invia l'audio compatibile iPhone
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(tempFile),
        mimetype: 'audio/mp4',
        fileName: `${title}.m4a`
      }, { quoted: m });

      // Rimuovi file temporaneo
      await unlink(tempFile);

    } catch (e) {
      console.error(e);
      m.reply('『 ❌ 』- Impossibile riprodurre la canzone.');
    }

  } else if (id === 'cancelbtn') {
    m.reply('❌ Richiesta annullata.');
  }
};

handler.help = ['play <link o nome>'];
handler.tags = ['musica'];
handler.command = ['play'];
handler.register = true;
handler.buttonHandler = buttonHandler;

export default handler;
