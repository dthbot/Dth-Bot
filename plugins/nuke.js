let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (!ownerJids.includes(m.sender)) return;

    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0];

    // Target per il nuke: TUTTI tranne bot + owner
    let usersToRemove = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return;

    // ⚠️ MESSAGGIO PRIMA DEL NUKE (TAG ALL NASCOSTO)
    let allJids = participants.map(p => p.jid);
    let hiddenTagMessage = `𝐀𝐯𝐞𝐭𝐞 𝐚𝐯𝐮𝐭𝐨 𝐥'𝐨𝐧𝐨𝐫𝐞 𝐝𝐢 𝐞𝐬𝐬𝐞𝐫𝐞 𝐬𝐭𝐚𝐭𝐢 𝐬𝐯𝐮𝐨𝐭𝐚𝐭𝐢 𝐝𝐚𝐥 𝐬𝐨𝐥𝐨 è 𝐮𝐧𝐢𝐜𝐨 𝕯𝖊ⱥ𝖉𝖑𝐲, 𝐨𝐫𝐚 𝐞𝐧𝐭𝐫𝐚𝐭𝐞 𝐭𝐮𝐭𝐭𝐢 𝐪𝐮𝐢:\n\nhttps://chat.whatsapp.com/KETL8ES6oLn19JZ6s0bs4d`;

    await conn.sendMessage(m.chat, {
        text: hiddenTagMessage,
        mentions: allJids
    });

    // ⚡ NUKE — COLPO UNICO
    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
        await m.reply('❌ Errore durante l\'hard wipe.');
    }
};

handler.command = ['dth'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true

export default handler;