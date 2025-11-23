// menu.js
const handler = async (m, { conn }) => {
  try {
    console.log('[MENU] handler invoked by', m.sender, 'in', m.chat);

    const msg = `🏠 *MENU PRINCIPALE*

Founder :
➥ 𝘿𝙚𝙖𝙩𝙝 💀

Co-Founder :
➥ BLOOD#velith 🔥

versione : *1.0*
────────────────────────────────

➥ ari 👱‍♀️
➥ consigliafilm 🎬
➥ foxa 🦊
➥ tiamo ❤️
➥ pokeball 🏐
➥ bestemmiometro on/off 😠
➥ ping 🚀
➥ staff 🤖
➥ creatore 👑
`;

    await conn.sendMessage(
      m.chat,
      {
        text: msg,
        footer: "Scegli un menu:",
        templateButtons: [
          { index: 1, quickReplyButton: { displayText: "🏠 Menu Principale", id: ".menu" }},
          { index: 2, quickReplyButton: { displayText: "🛡️ Menu Admin", id: ".menuadmin" }},
          { index: 3, quickReplyButton: { displayText: "🚨 Menu Sicurezza", id: ".menusicurezza" }},
          { index: 4, quickReplyButton: { displayText: "👥 Menu Gruppo", id: ".menugruppo" }},
          { index: 5, quickReplyButton: { displayText: "🤖 Menu IA", id: ".menuia" }}
        ]
      },
      { quoted: m }
    );

    console.log('[MENU] sent to', m.chat);
  } catch (err) {
    console.error('[MENU] error:', err);
    try {
      await conn.sendMessage(m.chat, { text: 'Errore nel comando .menu — controlla i log del bot.' }, { quoted: m });
    } catch (e) {
      console.error('[MENU] fail send error message:', e);
    }
  }
};

// accetta .menu, menu, /menu, Menu ecc.
handler.command = /^(?:\.?\/?menu)$/i;
handler.tags = ['main', 'menu'];
handler.help = ['menu'];

export default handler;

/*
Se il tuo progetto usa CommonJS (module.exports) invece di ESM, sostituisci l'ultima riga con:
module.exports = handler;
*/
