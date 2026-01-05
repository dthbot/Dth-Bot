const owners = [
  "584162501837@s.whatsapp.net"
];

let handler = async (m, { conn, participants, isBotAdmin }) => {
  if (!m.isGroup) return;
  if (!participants?.length) return;

  if (!isBotAdmin) {
    return m.reply("❌ Il bot non è admin.");
  }

  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

  // 🔥 FILTRI IMPORTANTI
  let usersToRemove = participants
    .filter(p =>
      !p.admin &&                 // ❌ no admin
      p.id !== botId &&           // ❌ no bot
      !owners.includes(p.id)      // ❌ no owner
    )
    .map(p => p.id);

  if (!usersToRemove.length) {
    return m.reply("⚠️ Nessun membro rimovibile (solo admin rimasti).");
  }

  await conn.sendMessage(m.chat, {
    text: `*〔𝐏𝐔𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍💮〕*\n` +
      usersToRemove.map(u => `@${u.split('@')[0]}`).join(' '),
    mentions: usersToRemove
  });

  let removed = 0;

  for (let user of usersToRemove) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], "remove");
      removed++;
      await new Promise(r => setTimeout(r, 1500)); // ⏱️ anti-ban
    } catch (e) {
      console.log("Errore rimozione:", user, e?.output?.statusCode);
    }
  }

  await m.reply(`👥 Rimossi: ${removed}/${usersToRemove.length}`);
};

handler.command = ["svuota"];
handler.group = true;
handler.botAdmin = true;

export default handler;