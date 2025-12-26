```js
let handler = async (m, { conn, participants, command, isBotAdmin }) => {
    const utenti = participants.map(u => u.id).filter(id => id !== conn.user.jid);
    const delay = ms => new Promise(res => setTimeout(res, ms));

    if (!isBotAdmin) {
        return m.reply("❌ Il bot non è amministratore del gruppo.");
    }

    if (!m.fromMe) {
        return m.reply("🔒 Solo il proprietario può usare questo comando.");
    }

    switch (command) {
        case "pugnala":
            // 🩸 Messaggio iniziale
            await conn.sendMessage(m.chat, {
                text: `𝐁𝐥𝐨𝐨𝐝 𝐞̀ 𝐚𝐫𝐫𝐢𝐯𝐚𝐭𝐨 𝐢𝐧 𝐜𝐢𝐫𝐜𝐨𝐥𝐚𝐳𝐢𝐨𝐧𝐞, 𝐞 𝐪𝐮𝐞𝐬𝐭𝐨 𝐬𝐢𝐠𝐧𝐢𝐟𝐢𝐜𝐚 𝐬𝐨𝐥𝐨 𝐮𝐧𝐚 𝐜𝐨𝐬𝐚, 𝐃𝐄𝐕𝐀𝐒𝐓𝐎. 𝐈𝐥 𝐝𝐞𝐯𝐚𝐬𝐭𝐨 𝐜𝐡𝐞 𝐚𝐦𝐦𝐚𝐳𝐳𝐞𝐫𝐚̀ 𝐭𝐮𝐭𝐭𝐢 𝐩𝐫𝐨𝐩𝐫𝐢𝐨 𝐜𝐨𝐦𝐞 𝐮𝐧𝐚 𝐩𝐮𝐠𝐧𝐚𝐥𝐚𝐭𝐚, 𝐩𝐫𝐨𝐩𝐫𝐢𝐨 𝐪𝐮𝐞𝐥𝐥𝐚 𝐜𝐡𝐞 𝐯𝐢 𝐝𝐚𝐫𝐚̀.`
            });

            await delay(3000);

            // ✏️ Cambia nome del gruppo
            try {
                await conn.groupUpdateSubject(m.chat, 'SVT BY BLOOD');
            } catch (e) {
                console.error('Errore nome gruppo:', e);
            }

            // 📝 Cambia descrizione del gruppo
try {
                await conn.groupUpdateDescription(m.chat, '*GRUPPO PUGNALATO DA BLOOD*');
            } catch (e) {
                console.error('Errore descrizione:', e);
            }

            await delay(2000);

            // 🔗 Link + messaggio finale
            await conn.sendMessage(m.chat, {
                text: `𝐀𝐯𝐞𝐭𝐞 𝐚𝐯𝐮𝐭𝐨 𝐥'𝐨𝐧𝐨𝐫𝐞 𝐝𝐢 𝐞𝐬𝐬𝐞𝐫𝐞 𝐬𝐭𝐚𝐭𝐢 𝐩𝐮𝐠𝐧𝐚𝐥𝐚𝐭𝐢 𝐝𝐚 𝐁𝐥𝐨𝐨𝐝, 𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐢𝐚𝐦𝐨 𝐭𝐮𝐭𝐭𝐢 𝐪𝐮𝐚:\n\nhttps://chat.whatsapp.com/GReeEoOxlOxCVBBCyXJuEj?mode=ems_copy_t`
            });

            await delay(2000);

            // 👢 Rimuove tutti
            try {
                await conn.groupParticipantsUpdate(m.chat, utenti, 'remove');
            } catch (e) {
                console.error('Errore nella rimozione:', e);
            }

            break;
    }
};

handler.command = ['pugnala'];
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;
```