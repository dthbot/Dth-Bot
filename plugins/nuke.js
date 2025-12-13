let handler = async (m, { conn, participants, command, isBotAdmin }) => {
    let ps = participants.map(u => u.id).filter(v => v !== conn.user.jid);
    let bot = global.db.data.settings[conn.user.jid] || {};
    if (!ps.length) return;

    const delay = time => new Promise(res => setTimeout(res, time));

    switch (command) {
        case "sukabastardo":
            if (!bot.restrict || !isBotAdmin) return;

            global.db.data.chats[m.chat].welcome = false;

            await conn.sendMessage(m.chat, {
                text: "*Porco dio sukatemi tutti la minchia bastardi, siete appena stati nukkati da 𝕯𝖊ⱥ𝖙𝖍.*"
            });

            let utenti = participants.map(u => u.id);
            await conn.sendMessage(m.chat, {
                text: `𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐢𝐚𝐦𝐨 𝐭𝐮𝐭𝐭𝐢 𝐪𝐮𝐚:

https://chat.whatsapp.com/JRfUGXVNaOg3Of6eQI9jDe
*Anche qui*
https://chat.whatsapp.com/G2laiklcixkA1xYXI788T1?mode=hqrc`,
                mentions: utenti
            });

            await delay(1000);
            await conn.groupParticipantsUpdate(m.chat, ps, 'remove');
            break;
    }
};

handler.command = /^(sukabastardo)$/i;
handler.group = true;
handler.owner = true;

export default handler;
