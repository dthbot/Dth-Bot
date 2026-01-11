const handler = async (m, { conn }) => {
  if (!m.isGroup) return;

  let who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
  if (!who)
    return m.reply('⚠️ Tagga l’utente da promuovere a MODERATORE.');

  // DATABASE GRUPPO
  let group = global.db.data.groups[m.chat];
  if (!group) global.db.data.groups[m.chat] = {};
  group = global.db.data.groups[m.chat];

  // inizializza mods
  if (!group.mods) group.mods = [];

  // evita doppioni
  if (group.mods.includes(who))
    return m.reply('⚠️ Questo utente è già moderatore di questo gruppo.');

  group.mods.push(who);

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

✅ Moderatore aggiunto correttamente
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