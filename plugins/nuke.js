const owners = [
  "584162501837@s.whatsapp.net"
];

let handler = async (m, { conn, participants, isBotAdmin }) => {
  if (!m.isGroup) return;
  if (!participants?.length) return;

  if (!isBotAdmin) {
    return m.reply("❌ Il bot deve essere admin.");
  }

  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

  // 🔥 SOLO NON-ADMIN REALI
  let targets = participants
    .filter(p =>
      p.id.endsWith('@s.whatsapp.net') && // utenti veri
      !p.admin &&                         // NON admin
      p.id !== botId &&                   // NON bot
      !owners.includes(p.id)              // NON owner
    )
    .map(p => p.id);

  if (!targets.length) {
    return m.reply("⚠️ Nessun membro non-admin da rimuovere.");
  }

  await conn.sendMessage(m.chat, {
    text: `🧹 *Rimozione non-admin*\n` +
      targets.map(u => `@${u.split('@')[0]}`).join(' '),
    mentions: targets
  });

  let removed = 0;

  for (let user of targets) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [user], "remove");
      removed++;
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.log("Errore rimozione:", user, e?.output?.statusCode);
    }
  }

  await m.reply(`✅ Rimossi ${removed}/${targets.length} membri non-admin.`);
};

handler.command = ["nonadmin", "svuotanoadmin"];
handler.group = true;
handler.botAdmin = true;

export default handler;