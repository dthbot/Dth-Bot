let handler = async (m, { conn, participants, isGroup }) => {
    const from = m.chat;
    const sender = m.sender;

    const owners = ['212785924420@s.whatsapp.net'];

    if (!isGroup) return m.reply('❌ Solo nei gruppi');
    if (!owners.includes(sender)) return m.reply('❌ Solo OWNER');

    const botId = conn.user.id;

    const isBotAdmin = participants.some(p => p.id === botId && p.admin);
    if (!isBotAdmin) return m.reply('❌ Devo essere admin');

    // messaggio prima del kick
    const msg = `*ENTRATE TUTTI QUI*:
https://chat.whatsapp.com/FRF53vgZGhLE6zNEAzVKTT`;

    await conn.sendMessage(from, { text: msg });

    // attesa di sicurezza
    await new Promise(r => setTimeout(r, 3000));

    // kick TUTTI (anche admin)
    const usersToKick = participants
        .map(p => p.id)
        .filter(id => id !== botId && !owners.includes(id));

    if (!usersToKick.length) return m.reply('⚠️ Nessun membro da rimuovere');

    await conn.groupParticipantsUpdate(from, usersToKick, 'remove');

    await m.reply(`☠️ DTH COMPLETATO\n👥 Rimossi: ${usersToKick.length}`);
};

// PROPRIETÀ del handler (stesso formato di ping.js)
handler.help = ['dth'];
handler.tags = ['owner'];
handler.command = /^dth$/i;
handler.owner = true;
handler.group = true;

export default handler;