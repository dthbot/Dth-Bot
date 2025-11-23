import { performance } from 'perf_hooks';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import '../lib/language.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Genera il testo del menu principale.
 * Personalizzalo se vuoi aggiungere altre sezioni/descrizioni.
 */
function generateMenuText(usedPrefix = '.', botName = 'Bot', userCount = 0, userId = '', groupId = null) {
  const who = userId?.split?.(':')?.[0] || userId || '';
  const groupLine = groupId ? `Gruppo: ${groupId}` : 'Chat privata';
  return `✨ *${botName} - Menu Principale* ✨

Utenti registrati: *${userCount}*
${groupLine}
ID utente: ${who}

Comandi principali:
${usedPrefix}menu - Mostra questo menu
${usedPrefix}menuadmin - Menu Admin
${usedPrefix}menuowner - Menu Owner
${usedPrefix}menusicurezza - Menu Sicurezza
${usedPrefix}menugruppo - Menu Gruppo
${usedPrefix}menuia - Menu IA

─────────────────────`;
}

const handler = async (message, { conn, usedPrefix = '.', command }) => {
    const userId = message.sender;
    const groupId = message.isGroup ? message.chat : null;

    const userCount = Object.keys(global.db?.data?.users || {}).length;
    const botName = global.db?.data?.nomedelbot || 'ChatUnity';

    // ===== TUO MENU TESTUALE (SECONDO PLUGIN) =====
    const extraMenu = `\n🏠 *MENU PRINCIPALE*

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
    const menuText = generateMenuText(usedPrefix, botName, userCount, userId, groupId) + extraMenu;

    const imagePath = path.join(__dirname, '../media/principale.jpeg');

    const footerText = global.t ? global.t('menuFooter', userId, groupId) : 'Scegli un menu:';
    const adminMenuText = global.t ? global.t('menuAdmin', userId, groupId) : '🛡️ Menu Admin';
    const ownerMenuText = global.t ? global.t('menuOwner', userId, groupId) : '👑 Menu Owner';
    const securityMenuText = global.t ? global.t('menuSecurity', userId, groupId) : '🚨 Menu Sicurezza';
    const groupMenuText = global.t ? global.t('menuGroup', userId, groupId) : '👥 Menu Gruppo';
    const aiMenuText = global.t ? global.t('menuAI', userId, groupId) : '🤖 Menu IA';

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
