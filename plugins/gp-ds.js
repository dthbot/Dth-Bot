//Plugin fatto da Axtral_WiZaRd
import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {

  try {
    const sessionFolder = "./sessioni/";

    if (!existsSync(sessionFolder)) {
      return conn.sendMessage(m.chat, {
        text: "❗ *Non c’erano sessioni da eliminare.*"
      }, { quoted: m });
    }

    const sessionFiles = await fsPromises.readdir(sessionFolder);
    let deleted = 0;

    for (const file of sessionFiles) {
      if (file !== "creds.json") {
        await fsPromises.unlink(path.join(sessionFolder, file));
        deleted++;
      }
    }

    const msg =
      deleted === 0
        ? "❗ *Non c’erano sessioni da eliminare.*"
        : `🔥 *Sono stati eliminati ${deleted} spermatozoi 💦! Grazie per avermi svuotato le palle 🪽*`;

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m });

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: "❌ *Errore durante l’eliminazione delle sessioni!*"
    }, { quoted: m });
  }

};

handler.help = ['clearallsession'];
handler.tags = ["owner"];
handler.command = /^(deletession|ds|clearallsession)$/i;
handler.admin = true;

export default handler;
