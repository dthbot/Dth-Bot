import '../lib/language.js';

const handler = async (message, { conn, usedPrefix }) => {

    const menuText = `
╔══════════════════════╗
        ⚡ 𝑴𝑬𝑵𝑼 𝑶𝑾𝑵𝑬𝑹 ⚡
╚══════════════════════╝

─❖🚫 𝐆𝐄𝐒𝐓𝐈𝐎𝐍𝐄 𝐔𝐓𝐄𝐍𝐓𝐈❖─
➤ 𝐁𝐚𝐧𝐮𝐬𝐞𝐫 🔇  
➤ 𝐔𝐧𝐛𝐚𝐧𝐮𝐬𝐞𝐫 🔊  

─❖👋 𝐆𝐄𝐒𝐓𝐈𝐎𝐍𝐄 𝐁𝐎𝐓❖─
➤ 𝐉𝐨𝐢𝐧 + 𝐋𝐢𝐧𝐤 ⚠️  
➤ 𝐎𝐮𝐭 👋  
➤ 𝐀𝐠𝐠𝐢𝐨𝐫𝐧𝐚 🌐  

─❖📢 𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐈 𝐒𝐏𝐄𝐂𝐈𝐀𝐋𝐈❖─
➤ 𝐁𝐢𝐠𝐓𝐚𝐠  
➤ 𝐁𝐨𝐧𝐨𝐢𝐫 (AFK mode) 🚫  
➤ 𝐖𝐚𝐤𝐞𝐲𝐰𝐚𝐤𝐞𝐲 ✅  

══════════════════════
🔖 𝐕𝐞𝐫𝐬𝐢𝐨𝐧𝐞: 2.0
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