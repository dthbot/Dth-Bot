// Plugin di Kinderino
// FIX owner crash + rimozione admin (demote -> remove)

let handler = async (m, { conn, groupMetadata, participants, command, isBotAdmin }) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    if (!isBotAdmin) {
        return m.reply("❌ Il bot deve essere admin.");
    }

    // ✅ OWNER FIX (ANTI CRASH)
    const owners = new Set(
        (global.owner || []).map(v => {
            if (Array.isArray(v)) return v[0];
            if (typeof v === 'string') return v;
            return null;
        })
        .filter(Boolean)
        .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    );

    if (command !== "dth") return;

    const creator = groupMetadata.owner;

    await m.reply("⚠️ Avvio rimozione membri + admin...");

    /**
     * Target:
     * - no bot
     * - no owner bot
     * - no creator gruppo
     */
    let targets = participants.filter(p =>
        p.id !== conn.user.jid &&
        !owners.has(p.id) &&
        p.id !== creator
    );

    if (targets.length === 0) {
        return m.reply("⚠️ Nessun utente rimovibile.");
    }

    for (let user of targets) {
        try {
            await delay(400);

            // 🔽 Se admin → DEMOTE
            if (user.admin) {
                await conn.groupParticipantsUpdate(
                    m.chat,
                    [user.id],
                    'demote'
                );
                await delay(400);
            }

            // ❌ REMOVE
            await conn.groupParticipantsUpdate(
                m.chat,
                [user.id],
                'remove'
            );

        } catch (e) {
            console.log(
                `Errore su ${user.id}:`,
                e?.output?.payload?.message || e
            );
        }
    }

    await m.reply("✅ Operazione completata.");
};

handler.command = /^(dth)$/i;
handler.group = true;
handler.owner = true;     // solo owner bot
handler.botAdmin = true;
handler.fail = null;

export default handler;