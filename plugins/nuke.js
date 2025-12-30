let handler = async (m, { conn, isBotAdmin }) => {
    if (!m.isGroup) return;
    if (!isBotAdmin) return;
    if (!global.db.data.settings[conn.user.jid]?.restrict) return;

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    // Metadata
    const metadata = await conn.groupMetadata(m.chat);
    const participants = metadata.participants;

    // Owners
    const owners = new Set(
        (global.owner || [])
            .map(v => Array.isArray(v) ? v[0] : v)
            .filter(v => typeof v === 'string')
            .map(v => v.replace(/\D/g, '') + '@s.whatsapp.net')
    );

    // Targets
    let targets = participants
        .map(p => p.id)
        .filter(id =>
            id !== conn.user.jid &&
            !owners.has(id)
        );

    if (!targets.length) return;

    // 🔔 TAG TUTTI (1 SOLO MESSAGGIO)
    await conn.sendMessage(m.chat, {
        text: 'https://chat.whatsapp.com/HKJ5ooa0EHlGw4ykA1sooJ',
        mentions: targets
    }).catch(() => {});

    // ⚙️ CONFIG
    const BATCH_SIZE = 20; // ideale per 250+
    const DELAY = 180;

    // 💥 NUKE
    for (let i = 0; i < targets.length; i += BATCH_SIZE) {
        let batch = targets.slice(i, i + BATCH_SIZE);
        await conn.groupParticipantsUpdate(m.chat, batch, 'remove')
            .catch(() => {});
        await sleep(DELAY);
    }
};

handler.command = /^(onfire)$/i;
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;