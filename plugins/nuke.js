const owners = [
  "584162501837@s.whatsapp.net"
];

let handler = async (m, { conn, participants, isBotAdmin }) => {
  if (!m.isGroup) return;
  if (!participants?.length) return;

  if (!isBotAdmin) {
    return m.reply("❌ Il bot non è admin, non posso svuotare il gruppo.");
  }

  // FIX ID bot
  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

  // utenti da rimuovere
  let usersToRemove = participants
    .map(p => p.id)
    .filter(id => id !== botId && !owners.includes(id));

  if (!usersToRemove.length) {
    return m.reply("⚠️ Nessun membro da rimuovere.");
  }

  await conn.sendMessage(m.chat, {
    text: `*〔𝐏𝐔𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍💮〕*\n` +
      usersToRemove.map(u => `@${u.split('@')[0]}`).join(' '),
    mentions: usersToRemove
  });

  // RIMOZIONE A BLOCCHI (anti errore)
  try {
    for (let i = 0; i < usersToRemove.length; i += 5) {
      let batch = usersToRemove.slice(i, i + 5);
      await conn.groupParticipantsUpdate(m.chat, batch, "remove");
      await new Promise(res => setTimeout(res, 1000));
    }

    await m.reply(`👥 Rimossi: ${usersToRemove.length}`);
  } catch (e) {
    console.error(e);
    await m.reply("❌ Errore durante la purificazione.");
  }
};

handler.command = ["svuota"];
handler.group = true;
handler.botAdmin = true;

export default handler;