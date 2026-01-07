import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import '../lib/language.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn, usedPrefix, command }) => {
    const userId = message.sender;
    const groupId = message.isGroup ? message.chat : null;

    // NUOVO MENU TESTO
    const menuText = `
⚡ 𝑴𝑬𝑵𝑼 𝑶𝑾𝑵𝑬𝑹 ⚡
════════════════════
🚫 *GESTIONE UTENTI*
➤ Banuser 🔇
➤ Unbanuser 🔊

👋 *GESTIONE BOT*
➤ Join + Link ⚠️
➤ Out 👋
➤ Aggiorna 🌐

📢 *FUNZIONI SPECIALI* 
➤ BigTag
➤ Bonoir (AFK mode) 🚫
➤ Wakeywakey ✅
════════════════════
🔖 Versione: 2.0
`.trim();

    const imagePath = path.join(__dirname, '../media/owner.jpeg');

    await conn.sendMessage(message.chat, {
        image: { url: imagePath },
        caption: menuText, // SOLO FOTO + NUOVO MENU
        buttons: [
            { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
            { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
            { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: "🚨 Menu Sicurezza" }, type: 1 },
            { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
            { buttonId: `${usedPrefix}menuia`, buttonText: { displayText: "🤖 Menu IA" }, type: 1 }
        ],
        viewOnce: true,
        headerType: 4
    });
};

handler.help = ['menuowner'];
handler.tags = ['menu'];
handler.command = /^(menuowner)$/i;

export default handler;