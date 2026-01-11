const handler = async (m, { conn, args }) => {

    const command = m.text.split(" ")[0].toLowerCase();

    // ========================
    // COMANDO ADDMOD (solo owner)
    // ========================
    if (command === 'addmod') {

        if (!m.isGroup) return m.reply("⚠️ Questo comando funziona solo nei gruppi.");
        if (!m.isOwner) return m.reply("❌ Solo il proprietario del bot può usare questo comando.");

        let who = m.mentionedJid ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
        if (!who) return m.reply('⚠️ Tagga l’utente da promuovere a *MODERATORE*.');

        let user = global.db.data.users[who];
        if (!user) {
            global.db.data.users[who] = {}; // inizializza se non presente
            user = global.db.data.users[who];
        }

        // Imposta premium permanente
        user.premium = true;
        user.premiumTime = Infinity;

        // Foto profilo
        let pp;
        try {
            pp = await conn.profilePictureUrl(who, 'image');
        } catch {
            pp = 'https://i.ibb.co/3Fh9V6p/avatar-contact.png';
        }

        const name = '@' + who.split('@')[0];

        const caption = `
👑 *MOD ATTIVATO* 👑

👤 Utente: ${name}
🛡️ Stato: *PERMANENTE*
🚀 Accesso completo sbloccato

✨ Benvenuto nello staff dei moderatori!
`.trim();

        await conn.sendMessage(
            m.chat,
            {
                image: { url: pp },
                caption,
                mentions: [who]
            },
            { quoted: m }
        );

        return;
    }

    // ========================
    // COMANDO MODERATORI
    // ========================
    if (command === 'moderatori' || command === 'mods' || command === 'staff') {

        // Prendi tutti i moderatori dal database
        const allUsers = global.db.data.users;
        const moderators = Object.entries(allUsers)
            .filter(([jid, user]) => user.premium === true)
            .map(([jid]) => jid);

        if (moderators.length === 0) {
            return m.reply("⚠️ Non ci sono moderatori nel database.");
        }

        const messaggioUtente = args.join(" ") || "Nessun messaggio inviato";

        // Testo decorato
        const testo = `ㅤㅤ⋆｡˚『 🔰 MODERATORS 🔰 』˚｡⋆\n\n${moderators.map((jid, i) => `『 *${i + 1}.* 』@${jid.split('@')[0]}`).join('\n')}\n\n『 🍥 』 \`Messaggio:\` » ${messaggioUtente}\n\n> Questo comando tagga tutti i moderatori registrati nel database.`.trim();

        await conn.sendMessage(
            m.chat,
            {
                text: testo,
                mentions: moderators
            },
            { quoted: m }
        );

        return;
    }
};

handler.help = ['addmod @user', 'moderatori <messaggio>'];
handler.tags = ['owner', 'gruppo'];
handler.command = ['addmod', 'moderatori', 'mods', 'staff'];
handler.group = true;
handler.owner = true; // addmod solo owner, moderatori può usarlo chiunque

export default handler;