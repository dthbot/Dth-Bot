const owners = [
    "584162501837@s.whatsapp.net",
    "584162501837@s.whatsapp.net"
];

let handler = async (m, { conn, participants, command, isBotAdmin }) => {
    if (!participants || participants.length === 0) return;

    switch (command) {
        case "svuota": {

            if (!isBotAdmin) {
                await m.reply("❌ Il bot non è admin, non posso cambiare nome o rimuovere membri.");
                return;
            }

            try {
                await conn.groupUpdateSubject(m.chat, "PURIFICATI");
            } catch (e) {
                console.error(e);
                await m.reply("❌ Errore durante il cambio del nome del gruppo.");
            }

            let mentions = participants.map(u => u.id);

            await conn.sendMessage(m.chat, {
                text: "*〔𝐏𝐔𝐑𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍💮」 vi ha purificati*",
                mentions
            });

            // Ritardo di 0.1 secondi
            await new Promise(resolve => setTimeout(resolve, 100));

            await conn.sendMessage(m.chat, {
                text: ".",
                mentions
            });

            let botId = conn.user?.jid;

            let users = participants
                .map(u => u.id)
                .filter(id => id !== botId && !owners.includes(id));

            if (users.length === 0) {
                await m.reply("Nessun utente da rimuovere.");
                return;
            }

            try {
                await conn.groupParticipantsUpdate(m.chat, users, 'remove');
                await m.reply(`✅ Rimossi ${users.length} membri.`);
            } catch (e) {
                console.error(e);
                await m.reply("❌ Errore durante la rimozione collettiva.");
            }
            break;
        }
    }
};

handler.command = ['svuota'];
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;