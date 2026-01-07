import '../lib/language.js';

/**
 * Menu principale con utenti registrati
 */
function generateMenuText(userCount = 0, vs = '2.0') {
    return `
𝔻𝕋ℍ-𝔹𝕆𝕋 *MENU PRINCIPALE*

👥 Utenti registrati: *${userCount}*

════════════════════
👑 *FOUNDER*
➤ 𝕯𝖊ⱥ𝖉𝖑𝐲
════════════════════
⚙️ *COMANDI*
➤ Gruppidth 🤖
➤ Rsban 👾
➤ Ping 🚀
➤ Staff 🤖
➤ Creatore 👑
════════════════════
🔖 Versione: ${vs}
`.trim();
}

const handler = async (message, { conn, usedPrefix = '.' }) => {

    const userId = message.sender;
    const groupId = message.isGroup ? message.chat : null;

    const userCount = Object.keys(global.db?.data?.users || {}).length;
    const vs = global.vs || '2.0';

    const menuText = generateMenuText(userCount, vs);

    const footerText = global.t
        ? global.t('menuFooter', userId, groupId)
        : 'Scegli un menu:';

    const adminMenuText = global.t
        ? global.t('menuAdmin', userId, groupId)
        : '🛡️ Menu Admin';

    const ownerMenuText = global.t
        ? global.t('menuOwner', userId, groupId)
        : '👑 Menu Owner';

    const securityMenuText = global.t
        ? global.t('menuSecurity', userId, groupId)
        : '🚨 Menu Sicurezza';

    const groupMenuText = global.t
        ? global.t('menuGroup', userId, groupId)
        : '👥 Menu Gruppo';

    const aiMenuText = global.t
        ? global.t('menuAI', userId, groupId)
        : '🤖 Menu IA';

    await conn.sendMessage(message.chat, {
        text: menuText,
        footer: footerText,
        buttons: [
            { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: adminMenuText }, type: 1 },
            { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: ownerMenuText }, type: 1 },
            { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: securityMenuText }, type: 1 },
            { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: groupMenuText }, type: 1 },
            { buttonId: `${usedPrefix}menuia`, buttonText: { displayText: aiMenuText }, type: 1 }
        ],
        headerType: 1
    });
};

handler.help = ['menu', 'comandi'];
handler.tags = ['menu'];
handler.command = /^(menu|comandi)$/i;

export default handler;