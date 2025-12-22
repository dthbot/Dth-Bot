let delay = ms => new Promise(res => setTimeout(res, ms));

let handler = async (m, { conn, args }) => {

  if (!args[0]) {
    return m.reply('❌ Usa il comando così:\n*.xban 393xxxxxxxxx*');
  }

  // Numero originale
  let rawNumber = args[0];

  // Controllo prefisso +1
  if (rawNumber.startsWith('+1') || rawNumber.startsWith('1')) {
    let num = rawNumber.replace(/\D/g, '');
    let jid = num + '@s.whatsapp.net';

    return conn.reply(
      m.chat,
      `😭 Non posso bannarti perché hai il +1`,
      m,
      { mentions: [jid] }
    );
  }

  // Pulizia numero
  let number = rawNumber.replace(/\D/g, '');
  let jid = number + '@s.whatsapp.net';
  let target = '@' + number;

  let messages = [
    `⚠️ ${target}, stai per essere bannato.`,
    `❓ ${target}, sei pronto?`,
    `⏳ Ci siamo quasi....`,
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
