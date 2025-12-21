import { performance } from 'perf_hooks';
import '../lib/language.js';

const handler = async (message, { conn, usedPrefix }) => {
    const imagePath = './media/ia.jpeg';

    const menuText = `
⚡ 𝑴𝑬𝑵𝑼 𝑰𝑨 ⚡
════════════════════
🤖 *CHAT INTELLIGENTE*
➤ Ia
➤ Gemini
➤ ChatGBT

🖼️ *GENERAZIONE IMMAGINI*
➤ Immagine
➤ Immagine 2
➤ Immagine 3

📄 *TESTO & UTILITÀz
➤ Riassunto
➤ Ricetta
════════════════════
🔖 Versione: 2.0
`.trim();

    await conn.sendMessage(message.chat, {
        image: { url: imagePath },
        caption: menuText,
        footer: 'Scegli un menu:',
        buttons: [
            { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
            { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
            { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: "👑 Menu Owner" }, type: 1 },
            { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
            { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: "🚨 Menu Sicurezza" }, type: 1 }
        ],
        viewOnce: true,
        headerType: 4,
    }, { quoted: message });
};

handler.help = ['menuia'];
handler.tags = ['menu'];
handler.command = /^(menuia|menuai)$/i;

export default handler;
