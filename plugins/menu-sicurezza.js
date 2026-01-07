let handler = async (m, { conn, usedPrefix }) => {

    const menuText = `
⚡ 𝑴𝑬𝑵𝑼 𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐈 ⚡
════════════════════
🛠️ *COMANDI BASE*
➤ .attiva (funzione)
➤ .disattiva (funzione)

🛡️ *PROTEZIONI*
➤ AntiSpam
➤ AntiTrava
➤ AntiNuke
➤ AntiBestemmie
➤ AntiBot on/off

🔒 *CONTROLLO GRUPPO* 
➤ SoloAdmin
➤ AntiMedia
➤ AntiLink
➤ AntiTikTok
➤ AntiInsta
➤ AntiAudio on/off
➤ AntiReazioni on/off
➤ AntiTelegram on/off
➤ AntiTag on/off

👋 *BENVENUTO*
➤ Benvenuto
════════════════════
🔖 Versione: 2.0
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