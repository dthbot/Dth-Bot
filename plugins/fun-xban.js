let delay = ms => new Promise(res => setTimeout(res, ms));

let handler = async (m, { conn, args }) => {

  // Controllo numero
  if (!args[0]) {
    return m.reply('❌ Usa il comando così:\n*.xban 393xxxxxxxxx*');
  }

  // Pulisce il numero
  let number = args[0].replace(/\D/g, '');
  let jid = number + '@s.whatsapp.net';

  let target = '@' + number;

  // Messaggi fake
  let messages = [
    `⚠️ ${target}, stai per essere bannato.`,
    `❓ ${target}, sei pronto?`,
    `⏳ Ci siamo quasi...`,
    `🚫 Fatto! ${target} è stato *bannato* 😈`
  ];

  for (let msg of messages) {
    await conn.reply(m.chat, msg, m, {
      mentions: [jid]
    });
    await delay(2000);
  }
};

handler.command = /^xban$/i;
handler.tags = ['fun'];
handler.help = ['xban <numero>'];
handler.group = true;

export default handler;
