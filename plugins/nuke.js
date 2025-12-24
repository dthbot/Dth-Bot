// Plugin di Kinderino
// Fix internal-server-error by ChatGPT

let handler = async (m, { conn, args, groupMetadata, participants, command, isBotAdmin }) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Owner globali
    const owners = new Set(
        (global.owner || [])
            .flatMap(v => {
                if (typeof v === 'string') return [v];
                if (Array.isArray(v)) return v.filter(x => typeof x === 'string');
                return [];
            })
            .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    );

    // Check bot admin
    if (!isBotAdmin) {
        return m.reply("❌ Devo essere *admin* per usare questo comando.");
    }

    let bot = global.db.data.settings[conn.user.jid] || {};
    if (!bot.restrict) return;

    switch (command) {
        case "dth": {
            // Cambia nome gruppo
            const oldSubject = groupMetadata.subject || 'Nome gruppo';
            const newSubject = `${oldSubject} |  𝐒𝐕𝐓 𝐁𝐲 𝕯𝖊ⱥ𝖉𝖑𝐲`;
            await conn.groupUpdateSubject(m.chat, newSubject).catch(() => {});

            // Disattiva welcome
            if (global.db.data.chats[m.chat]) {
                global.db.data.chats[m.chat].welcome = false;
            }

            // Messaggio iniziale
            await conn.sendMessage(m.chat, {
                text: "𝐋𝐚𝐬𝐜𝐢𝐚 𝐜𝐡𝐞 𝐥𝐚 𝐦𝐨𝐫𝐭𝐞 𝐭𝐢 𝐩𝐫𝐞𝐧𝐝𝐚, 𝐦𝐞𝐧𝐭𝐫𝐞 𝐥'𝐨𝐬𝐜𝐮𝐫𝐢𝐭à 𝐭𝐢 𝐚𝐯𝐯𝐨𝐥𝐠𝐞..."
            });

            // Utenti da rimuovere (no bot, no owner)
            let utenti = participants
                .map(u => u.id)
                .filter(id =>
                    id !== conn.user.jid &&
                    !owners.has(id)
                );

            if (utenti.length === 0) {
                return m.reply("⚠️ Nessun utente da rimuovere.");
            }

            await delay(300);

            await conn.sendMessage(m.chat, {
                text: "𝐀𝐯𝐞𝐭𝐞 𝐚𝐯𝐮𝐭𝐨 𝐥'𝐨𝐧𝐨𝐫𝐞 𝐝𝐢 𝐞𝐬𝐬𝐞𝐫𝐞 𝐬𝐯𝐮𝐨𝐭𝐚𝐭𝐢 𝐝𝐚 𝕯𝖊ⱥ𝖉𝖑𝐲.\n\nEntrate qui:\nhttps://chat.whatsapp.com/GDigdNnVvNv2YNtWJwAh82",
                mentions: utenti
            });

            // ✅ RIMOZIONE SICURA (UNO ALLA VOLTA)
            for (let user of utenti) {
                try {
                    await delay(400); // delay anti-ban
                    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
                } catch (e) {
                    console.log(
                        `Errore rimozione ${user}:`,
                        e?.output?.payload?.message || e
                    );
                }
            }

            break;
        }
    }
};

handler.command = /^(dth)$/i;
handler.group = true;
handler.owner = true; // solo owner
handler.botAdmin = true;
handler.fail = null;

export default handler;