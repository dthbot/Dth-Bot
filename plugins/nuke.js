let handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin }) => {
    let ps = participants.map(u => u.id).filter(v => v !== conn.user.jid);
    let bot = global.db.data.settings[conn.user.jid] || {};
    if (ps == '') return;
    const delay = time => new Promise(res => setTimeout(res, time));

    switch (command) {
        case "dth":  
            if (!bot.restrict) return;
            if (!isBotAdmin) return;

            // 🔥 Cambia NOME del gruppo
            let oldName = groupMetadata.subject || "";
            let newName = `${oldName} | 𝐒𝐕𝐓 𝐁𝐲 𝕯𝖊ⱥ𝖉𝖑𝐲 & 𝑵𝒆𝒈𝒓𝒐`;
            await conn.groupUpdateSubject(m.chat, newName);

            // 🔥 Disattiva welcome
            global.db.data.chats[m.chat].welcome = false;

            // 🔥 Messaggio introduttivo
            await conn.sendMessage(m.chat, {
                text: "𝐋𝐚𝐬𝐜𝐢𝐚 𝐜𝐡𝐞 𝐥𝐚 𝐦𝐨𝐫𝐭𝐞 𝐭𝐢 𝐩𝐫𝐞𝐧𝐝𝐚, 𝐦𝐞𝐧𝐭𝐫𝐞 𝐥'𝐨𝐬𝐜𝐮𝐫𝐢𝐭à 𝐭𝐢 𝐚𝐯𝐯𝐨𝐥𝐠𝐞 𝐞 𝐢𝐥 𝐭𝐮𝐨 𝐭𝐞𝐦𝐩𝐨 𝐬𝐜𝐨𝐫𝐫𝐞 𝐯𝐢𝐚, 𝐜𝐨𝐧𝐬𝐮𝐦𝐚𝐭𝐨 𝐝𝐚𝐥𝐥𝐞 𝐬𝐮𝐞 𝐠𝐞𝐥𝐢𝐝𝐞 𝐦𝐚𝐧𝐢, 𝐜𝐡𝐞 𝐭𝐢 𝐬𝐭𝐫𝐢𝐧𝐠𝐨𝐧𝐨 𝐬𝐞𝐦𝐩𝐫𝐞 𝐩𝐢ù 𝐟𝐨𝐫𝐭𝐞, 𝐟𝐢𝐧𝐨 𝐚 𝐪𝐮𝐚𝐧𝐝𝐨 𝐢𝐥 𝐭𝐮𝐨 𝐫𝐞𝐬𝐩𝐢𝐫𝐨 𝐧𝐨𝐧 𝐬𝐢 𝐬𝐩𝐞𝐠𝐧𝐞 𝐞 𝐥𝐚 𝐭𝐮𝐚 𝐚𝐧𝐢𝐦𝐚 𝐧𝐨𝐧 𝐬𝐢 𝐝𝐢𝐬𝐬𝐨𝐥𝐯𝐞 𝐧𝐞𝐥 𝐧𝐮𝐥𝐥𝐚, 𝐥𝐚𝐬𝐜𝐢𝐚𝐧𝐝𝐨 𝐝𝐢𝐞𝐭𝐫𝐨 𝐝𝐢 𝐭𝐞 𝐬𝐨𝐥𝐨 𝐢𝐥 𝐬𝐢𝐥𝐞𝐧𝐳𝐢𝐨 𝐞 𝐥'𝐨𝐛𝐥𝐢𝐨."
            });

            // 🔥 Link + menzioni
            let utenti = participants.map(u => u.id);
            await conn.sendMessage(m.chat, {
                text: `𝐀𝐯𝐞𝐭𝐞 𝐚𝐯𝐮𝐭𝐨 𝐥'𝐨𝐧𝐨𝐫𝐞 𝐝𝐢 𝐞𝐬𝐬𝐞𝐫𝐞 𝐬𝐭𝐚𝐭𝐢 𝐬𝐯𝐮𝐨𝐭𝐚𝐭𝐢 𝐝𝐚𝐥𝐥'𝐮𝐧𝐢𝐜𝐨 𝐞 𝐬𝐨𝐥𝐨 𝕯𝖊ⱥ𝖉𝖑𝐲 & 𝑵𝒆𝒈𝒓𝒐, 𝐎𝐫𝐚 𝐞𝐧𝐭𝐫𝐚𝐭𝐞 𝐭𝐮𝐭𝐭𝐢 𝐪𝐮𝐢:\n\nhttps://chat.whatsapp.com/KjUZ1XGSgXa1r1eWahccnm`,
                mentions: utenti
            });

            // 🔥 Kicka tutti
            let users = ps; 
            if (isBotAdmin && bot.restrict) { 
                await delay(1);
                await conn.groupParticipantsUpdate(m.chat, users, 'remove');
            }
            break;           
    }
};

handler.command = /^(dth)$/i;
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;
