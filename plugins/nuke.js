const owners = [
    "584162501837@s.whatsapp.net"
];

let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;
    if (!participants || participants.length === 0) return;

    if (!isBotAdmin) {
        return m.reply("❌ Il bot non è admin, non posso svuotare il gruppo.");
    }

    try {
        await conn.groupUpdateSubject(m.chat, "PURIFICATI");
    } catch (e) {
        console.error(e);
    }

    // ID bot
    const botId = conn.user?.id;

    // Lista utenti da rimuovere (tutti tranne bot e owner)
    let usersToRemove = participants
        .map(p => p.id)
        .filter(id => id !== botId && !owners.includes(id));

    if (usersToRemove.length === 0) {
        return m.reply("⚠️ Nessun membro da rimuovere.");
    }

    // Messaggio con mention
    await conn.sendMessage(m.chat, {
        text: `*〔𝐏𝐔𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍💮〕*\n` +
              usersToRemove.map(u => `@${u.split('@')[0]}`).join(' '),
        mentions: usersToRemove
    });

    try {
        await conn.groupParticipantsUpdate(
            m.chat,
            usersToRemove,
            "remove"
        );

        await m.reply(`👥 Rimossi: ${usersToRemove.length}`);
    } catch (e) {
        console.error(e);
        await m.reply("Riprova.");
    }
};

handler.command = ["svuota"];
handler.group = true;
handler.admin = false;
handler.botAdmin = true;

export default handler;