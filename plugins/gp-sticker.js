// sticker.js
// Comando: .sticker o .s
// Converte un'immagine o un breve video in sticker

import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { toSticker } from '../lib/sticker.js'; // assicurati di avere la funzione per creare sticker

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!/image|video/.test(mime))
        throw `📸 Invia o cita un'immagine o un breve video con *.sticker* o *.s*`;

    let media = await q.download();
    let filePath = join(tmpdir(), `sticker_${Date.now()}.webp`);

    try {
        let stickerBuffer = await toSticker(media, { pack: 'DeathBot', author: 'by Death' });
        writeFileSync(filePath, stickerBuffer);
        await conn.sendMessage(m.chat, { sticker: { url: filePath } }, { quoted: m });
    } catch (e) {
        console.error(e);
        m.reply('❌ Errore durante la creazione dello sticker.');
    } finally {
        try { unlinkSync(filePath); } catch {}
    }
};

// permette entrambi i comandi .sticker e .s
handler.command = /^s(ticker)?$/i;
handler.group = true; // solo nei gruppi (puoi togliere se vuoi anche in pv)
handler.admin = false; // tutti possono usarlo
handler.help = ['sticker', 's'];
handler.tags = ['fun'];

export default handler;
