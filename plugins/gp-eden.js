// plugin fatto da Death
let handler = async (m, { conn, command, text }) => {
  const message = `*Eden è una delle persone più belle e gentili che conosco, se la toccate vi uccido. Non mi vuole neanche più bene (guerra persa) 😎*`;
  // manda il messaggio nella chat dove il comando è stato usato, citandolo
  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['eden'];
handler.tags = ['fun'];
handler.command = /^eden$/i;

export default handler;
