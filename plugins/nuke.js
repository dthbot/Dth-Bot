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
            let newName = `${oldName} | 𝑺𝒗𝒕𝒕 𝑩𝒚 𝒁𝒚𝒌𝒂 & 𝑫𝒆𝒂𝒅𝒍𝒚`;
            await conn.groupUpdateSubject(m.chat, newName);

            // 🔥 Cambia DESCRIZIONE del gruppo
            let nuovaDescrizione = `𝔾𝕣𝕦𝕡𝕡𝕠 𝔻𝕠𝕞𝕚𝕟𝕒𝕥𝕠`;
            await conn.groupUpdateDescription(m.chat, nuovaDescrizione);

            // 🔥 Disattiva welcome
            global.db.data.chats[m.chat].welcome = false;

            // 🔥 Messaggio introduttivo
            await conn.sendMessage(m.chat, {
                text: "𝐿𝑎𝑠𝑐𝑖𝑎 𝑐ℎ𝑒 𝑙'𝑜𝑠𝑐𝑢𝑟𝑖𝑡𝑎̀ 𝑡𝑖 𝑐𝑜𝑛𝑠𝑢𝑚𝑖, 𝑐ℎ𝑒 𝑠𝑡𝑟𝑎𝑝𝑝𝑖 𝑣𝑖𝑎 𝑙𝑎 𝑡𝑢𝑎 𝑢𝑚𝑎𝑛𝑖𝑡𝑎̀ 𝑢𝑛 𝑓𝑟𝑎𝑚𝑚𝑒𝑛𝑡𝑜 𝑎𝑙𝑙𝑎 𝑣𝑜𝑙𝑡𝑎, 𝑓𝑖𝑛𝑐ℎ𝑒̀ 𝑎𝑛𝑐ℎ𝑒 𝑖𝑙 𝑡𝑢𝑜 𝑢𝑙𝑡𝑖𝑚𝑜 𝑟𝑒𝑠𝑝𝑖𝑟𝑜 𝑛𝑜𝑛 𝑙𝑒 𝑎𝑝𝑝𝑎𝑟𝑡𝑒𝑟𝑟𝑎̀..."
            });

            // 🔥 Link + menzioni
            let utenti = participants.map(u => u.id);
            await conn.sendMessage(m.chat, {
                text: '𝐎𝐫𝐚 𝐞𝐧𝐭𝐫𝐚𝐭𝐞 𝐭𝐮𝐭𝐭𝐢 𝐪𝐮𝐢:\n\nhttps://chat.whatsapp.com/DLSv8PfynEaD95HEQcWyzV',
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
