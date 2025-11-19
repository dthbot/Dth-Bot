// wm-plugin.js
import { Sticker, StickerTypes } from 'wa-sticker-formatter';

/*
  COMPORTAMENTO:
  - Rispondi a uno sticker con: .wm "messaggio"
  - Il bot crea un nuovo sticker identico ma con author = "messaggio"
  - Il bot invia il nuovo sticker e manda anche il testo "messaggio"
*/

let handler = async (m, { conn, text }) => {
  try {
    // Verifica che sia reply
    if (!m.quoted) return conn.sendMessage(m.chat, { text: '🔁 Rispondi ad uno sticker con: .wm "messaggio"' }, { quoted: m });

    // Controlla che il messaggio citato sia uno sticker
    const q = m.quoted;
    const isSticker = q.mtype === 'stickerMessage';
    if (!isSticker) return conn.sendMessage(m.chat, { text: '❌ Devi rispondere ad uno sticker.' }, { quoted: m });

    // Estrai il testo/author da text (accetta sia con che senza virgolette)
    let wm = (text || '').trim();
    if (!wm) return conn.sendMessage(m.chat, { text: '❌ Inserisci il testo da mettere come autore: .wm "messaggio"' }, { quoted: m });

    // Scarica lo sticker originale come buffer
    const stream = await conn.downloadMediaMessage(q);
    // stream è Buffer (webp)

    // Crea lo sticker con wa-sticker-formatter
    const sticker = new Sticker(stream, {
      pack: 'Sticker',            // nome pack (puoi cambiare)
      author: wm,                 // autore = messaggio fornito
      type: StickerTypes.FULL,    // FULL supporta animati/statici
      categories: ['😊'],
      id: 'com.yourbot',
      quality: 70,
    });

    const bufferSticker = await sticker.toBuffer(); // Buffer webp con EXIF

    // Invia sticker
    await conn.sendMessage(m.chat, { sticker: bufferSticker }, { quoted: m });

    // Invia il messaggio testuale che hai messo
    await conn.sendMessage(m.chat, { text: `✳️ Autore impostato: ${wm}` }, { quoted: m });

    // libera risorse
    sticker?.kill && sticker.kill();

  } catch (err) {
    console.error('ERROR .wm:', err);
    return conn.sendMessage(m.chat, { text: '❌ Errore durante la creazione dello sticker. Controlla i log.' }, { quoted: m });
  }
};

// esporta per il tuo sistema di handler (adattalo se usi un sistema diverso)
handler.command = ['wm'];
handler.tags = ['sticker'];
handler.help = ['wm'];

export default handler;
