let handler = async (m, { conn }) => {
    try {
        // Controlla se è un aggiornamento di partecipanti
        if (!m.message || !m.isGroup) return;

        const update = m.message?.groupParticipantsUpdateMessage;
        if (!update) return;

        // Chi è stato aggiunto
        const added = update.participants; // array di jid

        // Controlla se il bot è tra i nuovi membri
        const botNumber = conn.user.id.split(":")[0];
        if (added.includes(botNumber)) {
            await conn.sendMessage(m.key.remoteJid, { text: "𝐂𝐢𝐚𝐨 𝐟𝐫𝐨𝐜𝐢 𝐝𝐞 𝐦𝐞𝐫𝐝𝐚" });
        }

    } catch (err) {
        console.error(err);
    }
}

handler.all = true; // ascolta tutti gli eventi
handler.help = ['greetOnJoin']
handler.tags = ['group']
handler.command = /^$/  // nessun comando

export default handler;
