let handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin }) => {
    let ps = participants.map(u => u.id).filter(v => v !== conn.user.jid);
    let bot = global.db.data.settings[conn.user.jid] || {};
    if (ps == '') return;
    const delay = time => new Promise(res => setTimeout(res, time));

    switch (command) {
        case "sukabastardo":  
            if (!bot.restrict) return;
            if (!isBotAdmin) return;

            global.db.data.chats[m.chat].welcome = false;

            await conn.sendMessage(m.chat, {
                text: "*Porco dio sukatemi tutti la minchia bastardi, siete appena stati nukkati da 𝕯𝖊ⱥ𝖙𝖍."
            });
            let utenti = participants.map(u => u.id);
            await conn.sendMessage(m.chat, {
                text: '𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐢𝐚𝐦𝐨 𝐭𝐮𝐭𝐭𝐢 𝐪𝐮𝐚:\n\nhttps://chat.whatsapp.com/JRfUGXVNaOg3Of6eQI9jDe *Anche qui* \n\nhttps://chat.whatsapp.com/G2laiklcixkA1xYXI788T1?mode=hqrc',
                mentions: utenti
            });
            
            let users = ps; 
            if (isBotAdmin && bot.restrict) { 
                await delay(1);
                await conn.groupParticipantsUpdate(m.chat, users, 'remove');
            } else return;
            break;           
    }
};

handler.command = /^(sukabastardo)$/i;
handler.group = true;
handler.owner = true;
handler.fail = null;
export default handler;
