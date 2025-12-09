import { sticker } from '../lib/sticker.js';

const isUrl = (text) => /(https?:\/\/.*\.(?:png|jpe?g))/i.test(text);

let handler = async (m, { conn, args }) => {
  let stiker = false;

  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    // Supporta solo immagini
    if (/image/.test(mime)) {
      let buffer = await q.download?.();
      if (!buffer) return m.reply('『 📸 』- Invia un\'immagine per creare uno sticker.', m);

      const packName = '𝔻𝕋ℍ-𝔹𝕆𝕋';
      const authorName = '𝔻𝕋ℍ-𝔹𝕆𝕋';
      stiker = await sticker(buffer, false, packName, authorName);
    } 
    // URL diretto
    else if (args[0] && isUrl(args[0])) {
      const packName = '𝔻𝕋ℍ-𝔹𝕆𝕋';
      const authorName = '𝔻𝕋ℍ-𝔹𝕆𝕋';
      stiker = await sticker(false, args[0], packName, authorName);
    } else {
      return m.reply('『 📱 』- Rispondi a un\'immagine o invia un URL diretto a un\'immagine per creare uno sticker.', m);
    }
  } catch (e) {
    console.error('Errore gestore sticker:', e);
  }

  if (stiker) {
    await conn.sendFile(m.chat, stiker, 'sticker.webp', '『 ✅ 』- Sticker creato con successo!', m, true, { quoted: m });
  } else {
    return m.reply('『 📱 』- Impossibile creare lo sticker. Assicurati che sia un\'immagine valida.', m);
  }
};

handler.help = ['s', 'sticker', 'stiker'];
handler.tags = ['sticker', 'strumenti'];
handler.command = ['s', 'sticker', 'stiker'];
handler.register = true;

export default handler;
