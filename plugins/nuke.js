// Plugin di Kinderino
// FIX definitivo rimozione membri

let handler = async (m, { conn, groupMetadata, participants, command, isBotAdmin }) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    if (!isBotAdmin) {
        return m.reply("❌ Devo essere admin per usare questo comando.");
    }

    // Owner globali
    const owners = new Set(
        (global.owner || [])
            .flatMap(v => typeof v === 'string' ? [v] : v)
            .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    );

    if (command === "dth") {

        // Cambia nome gruppo
        const oldSubject = groupMetadata.subject || "Gruppo";
        await conn.groupUpdateSubject(
            m.chat,
            `${oldSubject} | 𝐒𝐕𝐓 𝐁𝐲 𝕯𝖊ⱥ𝖉𝖑𝐲`
        ).catch(() => {});

        // Messaggio iniziale
        await conn.sendMessage(m.chat, {
            text: "⚠️ Avvio rimozione membri non admin..."
        });

        /**
         * 🔴 FILTRO CORRETTO
         * Rimuove SOLO:
         * - non admin
         * - non owner
         * - non bot
         */
        let utenti = participants.filter(p =>
            !p.admin &&                       // ❗ SOLO NON ADMIN
            p.id !== conn.user.jid &&         // no bot
            !owners.has(p.id)                 // no owner
        ).map(p => p.id);

        if (utenti.length === 0) {
            return m.reply("⚠️ Nessun membro normale da rimuovere.");
        }

        // Rimozione sicura (1 alla volta)
        for (let user of utenti) {
            try {
                await delay(400);
                await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            } catch (e) {
                console.log("Errore rimozione:", user, e?.message || e);
            }
        }

        await m.reply(`✅ Rimossi ${utenti.length} membri.`);
    }
};

handler.command = /^(dth)$/i;
handler.group = true;
handler.owner = true;     // solo owner bot
handler.botAdmin = true;
handler.fail = null;

export default handler;