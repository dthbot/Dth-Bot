import '../lib/language.js';

const handler = async (message, { conn, usedPrefix }) => {

    const menuText = `
╔══════════════════════╗
        ⚙️ 𝑴𝑬𝑵𝑼 𝐀𝐃𝐌𝐈𝐍 ⚙️
╚══════════════════════╝

─❖👑 𝐆𝐄𝐒𝐓𝐈𝐎𝐍𝐄 𝐑𝐔𝐎𝐋𝐈❖─
➤ 𝐏 / 𝐏𝐫𝐨𝐦𝐮𝐨𝐯𝐢  
➤ 𝐑 / 𝐑𝐞𝐭𝐫𝐨𝐜𝐞𝐝𝐢  
➤ 𝐀𝐝𝐦𝐢𝐧𝐬  

─❖⚠️ 𝐖𝐀𝐑𝐍 & 𝐃𝐈𝐒𝐂𝐈𝐏𝐋𝐈𝐍𝐀❖─
➤ 𝐖𝐚𝐫𝐧  
➤ 𝐋𝐢𝐬𝐭𝐰𝐚𝐫𝐧  
➤ 𝐔𝐧𝐰𝐚𝐫𝐧  
➤ 𝐃𝐞𝐥𝐰𝐚𝐫𝐧  
➤ 𝐑𝐞𝐬𝐞𝐭𝐰𝐚𝐫𝐧  

─❖🔇 𝐂𝐎𝐍𝐓𝐑𝐎𝐋𝐋𝐎 𝐂𝐇𝐀𝐓❖─
➤ 𝐌𝐮𝐭𝐚  
➤ 𝐒𝐦𝐮𝐭𝐚  
➤ 𝐓𝐚𝐠  

─❖🔒 𝐈𝐌𝐏𝐎𝐒𝐓𝐀𝐙𝐈𝐎𝐍𝐈 𝐆𝐑𝐔𝐏𝐏𝐎❖─
➤ 𝐀𝐩𝐞𝐫𝐭𝐨  
➤ 𝐂𝐡𝐢𝐮𝐬𝐨  
➤ 𝐈𝐧𝐚𝐭𝐭𝐢𝐯𝐢  

─❖👋 𝐔𝐓𝐄𝐍𝐓𝐈❖─
➤ 𝐊𝐢𝐜𝐤  

─❖⛓️ 𝐌𝐄𝐒𝐒𝐀𝐆𝐆𝐈 𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐂𝐈❖─
➤ 𝐒𝐞𝐭𝐁𝐲𝐞  
➤ 𝐒𝐞𝐭𝐁𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨  

─❖🔗 𝐋𝐈𝐍𝐊❖─
➤ 𝐋𝐢𝐧𝐤  
➤ 𝐋𝐢𝐧𝐤𝐪𝐫  

══════════════════════
🔖 𝐕𝐞𝐫𝐬𝐢𝐨𝐧𝐞: 𝟐.𝟎
`.trim();

    await conn.sendMessage(message.chat, {
        text: menuText,
        buttons: [
            { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
            { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: "👑 Menu Owner" }, type: 1 },
            { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: "🚨 Menu Sicurezza" }, type: 1 },
            { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
            { buttonId: `${usedPrefix}menumod`, buttonText: { displayText: "🤖 Menu MOD" }, type: 1 }
        ],
        headerType: 1
    });
};

handler.help = ['menuadmin'];
handler.tags = ['menu'];
handler.command = /^(menuadmin)$/i;

export default handler;