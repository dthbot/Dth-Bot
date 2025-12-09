import { sticker } from '../lib/sticker.js';
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';

const isUrl = (text) => /(https?:\/\/.*\.(?:png|jpe?g|gif|webp))/i.test(text);

let handler = async (m, { conn, args }) => {
  let stiker = false;

  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    // Se è immagine, video o webp
    if (/image|video|webp/.test(mime)) {
      // Controllo durata video
      if (/video/.test(mime) && (q.msg || q).seconds > 10) {
        return m.reply('『 ⏰ 』- Il video deve durare meno di 10 secondi per creare uno sticker.');
      }

      let img;
      if (q.download) img = await q.download(); // scarica il buffer
      if (!img) return m.reply('『 📸 』- Invia un\'immagine, video o GIF per creare uno sticker.', m);

      try {
        const packName = global.authsticker || '✧˚🩸 varebot 🕊️˚✧';
        const authorName = global.nomepack || '✧˚🩸 varebot 🕊️˚✧';
        stiker = await sticker(img, false, packName, authorName);
      } catch (e) {
        console.error('Errore creazione sticker diretta:', e);
        try {
          // fallback upload
          let out = /image/.test(mime) ? await uploadImage(img) : await uploadFile(img);
          if (out) {
            const packName = global.authsticker || '✧˚🩸 varebot 🕊️˚✧';
            const authorName = global.nomepack || '✧˚🩸 varebot 🕊️˚✧';
            stiker = await sticker(false, out, packName, authorName);
          }
        } catch (err) {
          console.error('Errore fallback sticker:', err);
        }
      }
    } else if (args[0] && isUrl(args[0])) {
      const packName = global.authsticker || '✧˚🩸 varebot 🕊️˚✧';
      const authorName = global.nomepack || '✧˚🩸 varebot 🕊️˚✧';
      stiker = await sticker(false, args[0], packName, authorName);
    } else if (args[0]) {
      return m.reply('『 🔗 』- L\'URL fornito non è valido. Deve essere un link diretto a un\'immagine.');
    }
  } catch (e) {
    console.error('Errore gestore sticker:', e);
  }

  if (stiker) {
    await conn.sendFile(m.chat, stiker, 'sticker.webp', '『 ✅ 』- Sticker creato con successo!', m, true, { quoted: m });
  } else {
    return m.reply('『 📱 』- Rispondi a un\'immagine, video o GIF per creare uno sticker, oppure invia un URL di un\'immagine.', m);
  }
};

handler.help = ['s', 'sticker', 'stiker'];
handler.tags = ['sticker', 'strumenti'];
handler.command = ['s', 'sticker', 'stiker'];
handler.register = true;
export default handler;
