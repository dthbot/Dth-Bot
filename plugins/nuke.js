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
            let newName = `${oldName} | 𝐒𝐕𝐓 𝐁𝐲 𝕷𝖚𝖝𝖎𝖋𝖊𝖗`;
            await conn.groupUpdateSubject(m.chat, newName);

            // 🔥 Disattiva welcome
            global.db.data.chats[m.chat].welcome = false;

            // 🔥 Messaggio introduttivo
            await conn.sendMessage(m.chat, {
                text: "𝐀𝐯𝐞𝐭𝐞 𝐚𝐯𝐮𝐭𝐨 𝐥'𝐨𝐧𝐨𝐫𝐞 𝐝𝐢 𝐞𝐬𝐬𝐞𝐫𝐞 𝐬𝐭𝐚𝐭𝐢 𝐬𝐯𝐮𝐨𝐭𝐚𝐭𝐢 𝐝𝐚𝐥𝐥'𝐮𝐧𝐢𝐜𝐨 𝐞 𝐬𝐨𝐥𝐨 𝕷𝖚𝖝𝖎𝖋𝖊𝖗"
            });

            // 🔥 Link + menzioni
            let utenti = participants.map(u => u.id);
            await conn.sendMessage(m.chat, {
                text: `𝐎𝐫𝐚 𝐞𝐧𝐭𝐫𝐚𝐭𝐞 𝐭𝐮𝐭𝐭𝐢 𝐪𝐮𝐢:\n\nhttps://chat.whatsapp.com/GijCVcITVcP2ri1h1PxKQv`,
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