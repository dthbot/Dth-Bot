import '../lib/language.js';

const handler = async (message, { conn, usedPrefix }) => {

    const menuText = `
╔═════════════════════╗
      🌟 𝐌𝐄𝐍𝐔 𝐌𝐎𝐃
╚═════════════════════╝
➤ 𝐓𝐚𝐠𝐦𝐨𝐝
➤ 𝐏𝐢𝐧𝐠𝐦𝐨𝐝
➤ 𝐃𝐬𝐦𝐨𝐝
➤ 𝐖𝐚𝐫𝐧𝐦𝐨𝐝
➤ 𝐔𝐧𝐰𝐚𝐫𝐧𝐦𝐨𝐝
═════════════════════
🔖 𝐕𝐞𝐫𝐬𝐢𝐨𝐧𝐞: 𝟐.𝟎
`.trim();

    await conn.sendMessage(message.chat, {
        text: menuText,
        footer: 'Scegli un menu:',
        buttons: [
            { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
            { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
            { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: "👑 Menu Owner" }, type: 1 },
            { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
            { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: "🚨 Menu Sicurezza" }, type: 1 }
        ],
        headerType: 1
    }, { quoted: message });
};

handler.help = ['menumod'];
handler.tags = ['menu'];
handler.command = /^(menumod)$/i;

export default handler;