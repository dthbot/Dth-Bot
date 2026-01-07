import '../lib/language.js';

const handler = async (message, { conn, usedPrefix }) => {

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

    await conn.sendMessage(message.chat, {
        text: menuText,
        footer: "Scegli un menu:",
        buttons: [
            { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
            { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
            { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: "🚨 Menu Sicurezza" }, type: 1 },
            { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
            { buttonId: `${usedPrefix}menuia`, buttonText: { displayText: "🤖 Menu IA" }, type: 1 }
        ],
        headerType: 1
    });
};

handler.help = ['menuowner'];
handler.tags = ['menu'];
handler.command = /^(menuowner)$/i;

export default handler;