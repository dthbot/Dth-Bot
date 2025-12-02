// plugin fatto da Death
let handler = async (m, { conn, command, text }) => {
  const message = `𝐇𝐚𝐢 𝐩𝐫𝐨𝐯𝐚𝐭𝐨 𝐯𝐞𝐫𝐚𝐦𝐞𝐧𝐭𝐞 𝐡𝐚 𝐢𝐧𝐬𝐮𝐥𝐭𝐚𝐫𝐞 𝐋𝐨𝐫𝐝 𝐍𝐢𝐜𝐨 ? 😂 𝐕𝐞𝐝𝐢 𝐝𝐢 𝐬𝐭𝐚𝐫𝐭𝐢 𝐟𝐞𝐫𝐦𝐨 𝐬𝐞 𝐧𝐨𝐧 𝐯𝐮𝐨𝐢 𝐜𝐡𝐞 𝐥𝐚 𝐭𝐮𝐚 𝐯𝐢𝐭𝐚 𝐬𝐨𝐜𝐢𝐚𝐥𝐞 𝐯𝐚𝐝𝐚 𝐚 𝐩𝐮𝐭𝐭𝐚𝐧𝐞.`;
  // manda il messaggio nella chat dove il comando è stato usato, citandolo
  await conn.sendMessage(m.chat, { text: message }, { quoted: m });
};

handler.help = ['blood'];
handler.tags = ['fun'];
handler.command = /^insultalordnico|lordnico$/i;

export default handler;
