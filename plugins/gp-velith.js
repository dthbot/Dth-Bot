// plugin fatto da Death
let handler = async (m, { conn, command, text }) => {
  const message = `*Velith é la moglie di Blood, intoccabile sotto tutti i punti di vista.  
Meglio per voi stare lontani perché Blood vi distrugge senza pietà.  
Occhio che se la toccate Blood non guarda in faccia nessuno.*`;
  // manda il messaggio nella chat dove il comando è stato usato, citandolo
  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['velith'];
handler.tags = ['fun'];
handler.command = /^velith|mogliediblood$/i;

export default handler;
