let handler = async (m, { conn, usedPrefix }) => {

    const menuText = `
╔══════════════════════╗
        ⚡ 𝑴𝑬𝑵𝑼 𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐈 ⚡
╚══════════════════════╝

─❖🛠️ 𝐂𝐎𝐌𝐀𝐍𝐃𝐈 𝐁𝐀𝐒𝐄❖─
➤ .𝐚𝐭𝐭𝐢𝐯𝐚 (funzione)  
➤ .𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚 (funzione)  

─❖🛡️ 𝐏𝐑𝐎𝐓𝐄𝐙𝐈𝐎𝐍𝐈❖─
➤ 𝐀𝐧𝐭𝐢𝐒𝐩𝐚𝐦  
➤ 𝐀𝐧𝐭𝐢𝐓𝐫𝐚𝐯𝐚  
➤ 𝐀𝐧𝐭𝐢𝐍𝐮𝐤𝐞  
➤ 𝐀𝐧𝐭𝐢𝐁𝐞𝐬𝐭𝐞𝐦𝐦𝐢𝐞  
➤ 𝐀𝐧𝐭𝐢𝐁𝐨𝐭 on/off  

─❖🔒 𝐂𝐎𝐍𝐓𝐑𝐎𝐋𝐋𝐎 𝐆𝐑𝐔𝐏𝐏𝐎❖─
➤ 𝐒𝐨𝐥𝐨𝐀𝐝𝐦𝐢𝐧  
➤ 𝐀𝐧𝐭𝐢𝐌𝐞𝐝𝐢𝐚  
➤ 𝐀𝐧𝐭𝐢𝐋𝐢𝐧𝐤  
➤ 𝐀𝐧𝐭𝐢𝐓𝐢𝐤𝐓𝐨𝐤  
➤ 𝐀𝐧𝐭𝐢𝐈𝐧𝐬𝐭𝐚  
➤ 𝐀𝐧𝐭𝐢𝐀𝐮𝐝𝐢𝐨 on/off  
➤ 𝐀𝐧𝐭𝐢𝐑𝐞𝐚𝐳𝐢𝐨𝐧𝐢 on/off  
➤ 𝐀𝐧𝐭𝐢𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦 on/off  
➤ 𝐀𝐧𝐭𝐢𝐓𝐚𝐠 on/off  

─❖👋 𝐁𝐄𝐍𝐕𝐄𝐍𝐔𝐓𝐎❖─
➤ 𝐁𝐞𝐧𝐯𝐞𝐧𝐮𝐭𝐨  

══════════════════════
🔖 𝐕𝐞𝐫𝐬𝐢𝐨𝐧𝐞: 2.0
`.trim();

    await conn.sendMessage(m.chat, {
        text: menuText,
        footer: "Scegli un menu:",
        buttons: [
            { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
            { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
            { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: "💎 Menu Owner" }, type: 1 },
            { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
            { buttonId: `${usedPrefix}menuia`, buttonText: { displayText: "🤖 Menu IA" }, type: 1 }
        ],
        headerType: 1
    }, { quoted: m });
};

handler.help = ['menusicurezza', 'funzioni'];
handler.tags = ['menu'];
handler.command = /^(menusicurezza|funzioni)$/i;

export default handler;