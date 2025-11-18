let handler = async (m) => {
  global.db.data.chats[m.chat].isBanned = false;
  let message = 'ok padrone ho sbloccato sta merda di chat ✓';
  await conn.sendMessage(m.chat, { 
      text: message,
      contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: '120363259442839354@newsletter',
              serverMessageId: '',
              newsletterName: 'ChatUnity'
          }
      }
  }, { quoted: m });
};

handler.help = ['unbanchat'];
handler.tags = ['owner'];
handler.command = /^unbanchat|unbangp$/i;
handler.rowner = true;
export default handler;

