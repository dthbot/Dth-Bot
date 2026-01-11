const handler = async (m, { conn }) => {
  if (!m.isGroup) return;

  let who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
  if (!who)
    return m.reply('⚠️ Tagga l’utente da promuovere a MODERATORE.');

  // 🔒 INIZIALIZZA DATABASE CHAT (FIX ERRORE)
  if (!global.db.data.chats) global.db.data.chats = {};
  if (!global.db.data.chats[m.chat])
    global.db.data.chats[m.chat] = {};

  const chat = global.db.data.chats[m.chat];

  // 🔧 inizializza mods
  if (!Array.isArray(chat.mods)) chat.mods = [];

  if (chat.mods.includes(who))
    return m.reply('⚠️ Questo utente è già moderatore di questo gruppo.');

  chat.mods.push(who);

  let pp;
  try {
    pp = await conn.profilePictureUrl(who, 'image');
  } catch {
    pp = 'https://i.ibb.co/3Fh9V6p/avatar-contact.png';
  }

  const name = '@' + who.split('@')[0];

  await conn.sendMessage(
    m.chat,
    {
      image: { url: pp },
      caption: `
👑 MOD ATTIVATO 👑

👤 Utente: ${name}
🏘️ Gruppo: QUESTO
🛡️ Stato: SOLO QUI

✅ Operazione completata
`.trim(),
      mentions: [who]
    },
    { quoted: m }
  );
};

handler.command = ['addmod'];
handler.owner = true;
handler.group = true;

export default handler;