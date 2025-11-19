let handler = async (m) => {
  global.db.data.chats[m.chat].isBanned = false;
  let message = '𝐎𝐤 𝐩𝐚𝐝𝐫𝐨𝐧𝐞 𝐨𝐫𝐚 𝐬𝐛𝐥𝐨𝐜𝐜𝐨 𝐬𝐭𝐚 𝐦𝐞𝐫𝐝𝐚 𝐝𝐢 𝐜𝐡𝐚𝐭 ✓';
  await conn.sendMessage(m.chat, { 
      text: message,
      contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: '',
              serverMessageId: '',
              newsletterName: 'ChatUnity'
          }
      }
  }, { quoted: m });
};

handler.help = ['007sbant'];
handler.tags = ['owner'];
handler.command = /^007sban|sban007$/i;
handler.rowner = true;
export default handler;




