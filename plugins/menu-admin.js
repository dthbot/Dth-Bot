import '../lib/language.js';

const handler = async (message, { conn, usedPrefix }) => {

    const menuText = `
⚙️ 𝑴𝑬𝑵𝑼 𝐀𝐃𝐌𝐈𝐍 ⚙️
════════════════════
👑 *GESTIONE RUOLI*
➤ P / Promuovi
➤ R / Retrocedi
➤ Admins

⚠️ *WARN & DISCIPLINA*
➤ Warn
➤ Listwarn
➤ Unwarn
➤ Delwarn
➤ Resetwarn

🔇 *CONTROLLO CHAT* 
➤ Muta
➤ Smuta
➤ Tag

🔒 *IMPOSTAZIONI GRUPPO*
➤ Aperto
➤ Chiuso
➤ Inattivi

👋 *UTENTI*
➤ Kick

⛓️ *MESSAGGI AUTOMATICI*
➤ SetBye
➤ SetBenvenuto

🔗 *LINK*
➤ Link
➤ Linkqr
════════════════════
🔖 Versione: 2.0
`.trim();

    await conn.sendMessage(message.chat, {
        text: menuText,
        buttons: [
            { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
            { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: "👑 Menu Owner" }, type: 1 },
            { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: "🚨 Menu Sicurezza" }, type: 1 },
            { buttonId: `${usedPrefix}menugruppo`, buttonText: { displayText: "👥 Menu Gruppo" }, type: 1 },
            { buttonId: `${usedPrefix}menuia`, buttonText: { displayText: "🤖 Menu IA" }, type: 1 }
        ],
        headerType: 1
    });
};

handler.help = ['menuadmin'];
handler.tags = ['menu'];
handler.command = /^(menuadmin)$/i;

export default handler;