import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import '../lib/language.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn, usedPrefix, command }) => {
    const userId = message.sender
    const groupId = message.isGroup ? message.chat : null
    
    const userCount = Object.keys(global.db.data.users).length;
    const botName = global.db.data.nomedelbot || 'ChatUnity';

    // ===== TUO MENU TESTUALE (SECONDO PLUGIN) =====
    const extraMenu = `🏠 *MENU PRINCIPALE*

*Founder* :
➥ 𝕯𝖊ⱥ𝖙𝖍 💀

*Co-Founder* :
➥ 𝑩𝑳𝑶𝑶𝑫 🩸

─────────────────────

➥ Anesa 💎
➥ Ari 👱‍♀️
➥ Consigliafilm 🎬
➥ Foxa 🦊
➥ Velith 💎
➥ Blood 🩸
➥ Tiamo ❤️
➥ Pokeball 🏐
➥ Bestemmiometro on/off 😠
➥ Ping 🚀
➥ Staff 🤖
➥ Creatore 👑

_Versione_: *1.0*
_Collab_: 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕
`;

    // ===== MENU PRINCIPALE DEL PRIMO PLUGIN =====
    const menuText = generateMenuText(usedPrefix, botName, userCount, userId, groupId) + "\n\n" + extraMenu;

    const imagePath = path.join(__dirname, '../media/principale.jpeg'); 
    
    const footerText = global.t('menuFooter', userId, groupId) || 'Scegli un menu:'
    const adminMenuText = global.t('menuAdmin', userId, groupId) || '🛡️ Menu Admin'
    const ownerMenuText = global.t('menuOwner', userId, groupId) || '👑 Menu Owner'
    const securityMenuText = global.t('menuSecurity', userId, groupId) || '🚨 Menu Sicurezza'
    const groupMenuText = global.t('menuGroup', userId, groupId) || '👥 Menu Gruppo'
    const aiMenuText = global.t('menuAI', userId, groupId) || '🤖 Menu IA'
    
    await conn.sendMessage(
        message.chat,
        {
            image: { url: imagePath },
            caption: menuText,
            footer: footerText,
            buttons: [
                { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: adminMenuText }, type: 1 },
                { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: ownerMenuText }, type: 1 },
                { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: securityMenuText }, type: 1 },
                { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: groupMenuText }, type: 1 },
                { buttonId: `${usedPrefix}menuia`, buttonText: { displayText: aiMenuText }, type: 1 }
            ],
            viewOnce: true,
            headerType: 4
        }
    );
};

handler.help = ['menu'];
handler.tags = ['menu'];
handler.command = /^(menu|comandi)$/i;

export default handler;
