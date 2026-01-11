const handler = async (m, { conn }) => {
  let who;
  if (m.isGroup)
    who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
  else return;

  if (!who)
    return m.reply('⚠️ Tagga l’utente da promuovere a MODERATORE.');

  const chat = global.db.data.chats[m.chat];
  if (!chat)
    return m.reply('❌ Chat non trovata nel database.');

  // Inizializza lista moderatori del gruppo
  if (!chat.mods) chat.mods = {};

  // Imposta moderatore SOLO per questo gruppo
  chat.mods[who] = true;

  // Foto profilo
  let pp;
  try {
    pp = await conn.profilePictureUrl(who, 'image');
  } catch {
    pp = 'https://i.ibb.co/3Fh9V6p/avatar-contact.png';
  }

  const name = '@' + who.split('@')[0];

  const caption = `
👑 MOD ATTIVATO 👑

👤 Utente: ${name}
🏘️ Gruppo: ${chat.subject || 'Questo gruppo'}
🛡️ Stato: ATTIVO SOLO QUI

✨ Ora è moderatore di questo gruppo!
`.trim();

  await conn.sendMessage(
    m.chat,
    {
      image: { url: pp },
      caption,
      mentions: [who]
    },
    { quoted: m }
  );
};

handler.help = ['addmod @user'];
handler.tags = ['owner'];
handler.command = ['addmod'];
handler.group = true;
handler.owner = true;

export default handler;