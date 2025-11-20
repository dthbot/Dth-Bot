// plugin fatto da Death
let handler = async (m, { conn, command, text }) => {
  const message = `*Eden è una delle persone più belle e gentili che conosco — per favore rispettatela, lasciatela stare. Non fare drammi 😎*`;
  // manda il messaggio nella chat dove il comando è stato usato, citandolo
  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['eden'];
handler.tags = ['fun'];
handler.command = /^eden$/i;

export default handler;
