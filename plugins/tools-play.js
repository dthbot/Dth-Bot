import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import os from 'os';

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
      const tempFile = path.join(os.tmpdir(), Date.now() + '.mp3');

      await new Promise((resolve, reject) => {
        ffmpeg(ytdl(url, { filter: 'audioonly' }))
          .audioCodec('libmp3lame')
          .audioBitrate(128)
          .format('mp3')
          .save(tempFile)
          .on('end', resolve)
          .on('error', reject);
      });

      await conn.sendFile(m.chat, tempFile, `${title}.mp3`, `🎵 Ecco la tua canzone: ${title}`, m);
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
handler.buttonHandler = buttonHandler; // associa il listener dei bottoni

export default handler;
