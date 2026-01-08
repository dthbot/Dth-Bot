import '../lib/language.js';

const handler = async (message, { conn, usedPrefix }) => {

    const menuText = `
╔═════════════════════╗
      🤖 𝐂𝐇𝐀𝐓 𝐈𝐍𝐓𝐄𝐋𝐋𝐈𝐆𝐄𝐍𝐓𝐄
╚═════════════════════╝
➤ 𝐈𝐚  
➤ 𝐆𝐞𝐦𝐢𝐧𝐢  
➤ 𝐂𝐡𝐚𝐭𝐆𝐁𝐓  

╔═════════════════════╗
      🖼️ 𝐆𝐄𝐍𝐄𝐑𝐀𝐙𝐈𝐎𝐍𝐄 𝐈𝐌𝐌𝐀𝐆𝐈𝐍𝐈
╚═════════════════════╝
➤ 𝐈𝐦𝐦𝐚𝐠𝐢𝐧𝐞  
➤ 𝐈𝐦𝐦𝐚𝐠𝐢𝐧𝐞𝟐  
➤ 𝐈𝐦𝐦𝐚𝐠𝐢𝐧𝐞𝟑  

╔═════════════════════╗
      📄 𝐓𝐄𝐒𝐓𝐎 & 𝐔𝐓𝐈𝐋𝐈𝐓𝐀̀
╚═════════════════════╝
➤ 𝐑𝐢𝐚𝐬𝐬𝐮𝐧𝐭𝐨  
➤ 𝐑𝐢𝐜𝐞𝐭𝐭𝐚  

═════════════════════════
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

handler.help = ['menuia', 'menuai'];
handler.tags = ['menu'];
handler.command = /^(menuia|menuai)$/i;

export default handler;