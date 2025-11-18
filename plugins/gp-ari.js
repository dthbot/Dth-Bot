// Plugin .ari — invia un messaggio dolce :)
let handler = async (m, { conn }) => {
  let message = "Arianna sei un obesa💖";
  await conn.reply(m.chat, message, m);
};

handler.help = ['ari'];
handler.tags = ['fun'];
handler.command = /^ari$/i;

export default handler;
