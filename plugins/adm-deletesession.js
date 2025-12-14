//Plugin fatto da Axtral_WiZaRd
import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {

  try {
    const sessionFolder = "./sessioni/";

    if (!existsSync(sessionFolder)) {
      return conn.sendMessage(
        m.chat,
        {
          text: "❗ *Non c’erano sessioni da eliminare.*",
          buttons: [
            { buttonId: ".ping", buttonText: { displayText: "⏳ 𝐏𝐢𝐧𝐠" }, type: 1 },
            { buttonId: ".ds", buttonText: { displayText: "🗑️ 𝐑𝐢𝐟𝐚𝐢 𝐃𝐒" }, type: 1 },
          ],
          headerType: 1,
        },
        { quoted: m }
      );
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

    await conn.sendMessage(
      m.chat,
      {
        text: msg,
        buttons: [
          { buttonId: ".ping", buttonText: { displayText: "⏳ 𝐏𝐢𝐧𝐠" }, type: 1 },
          { buttonId: ".ds", buttonText: { displayText: "🗑️ 𝐑𝐢𝐟𝐚𝐢 𝐃𝐒" }, type: 1 },
        ],
        headerType: 1,
      },
      { quoted: m }
    );

  } catch (e) {
    await conn.sendMessage(
      m.chat,
      {
        text: "❌ *Errore durante l’eliminazione delle sessioni!*",
        buttons: [
          { buttonId: ".ping", buttonText: { displayText: "⏳ 𝐏𝐢𝐧𝐠" }, type: 1 },
          { buttonId: ".ds", buttonText: { displayText: "🗑️ 𝐑𝐢𝐟𝐚𝐢 𝐃𝐒" }, type: 1 },
        ],
        headerType: 1,
      },
      { quoted: m }
    );
  }

};

handler.help = ['clearallsession'];
handler.tags = ["owner"];
handler.command = /^(deletession|ds|clearallsession)$/i;
handler.admin = true;

export default handler;
           
