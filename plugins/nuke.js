// Plugin di Kinderino
// FIX DEFINITIVO: demote e remove separati

let handler = async (m, { conn, groupMetadata, participants, command, isBotAdmin }) => {
    const delay = ms => new Promise(res => setTimeout(res, ms));

    if (!isBotAdmin) {
        return m.reply("❌ Il bot deve essere admin.");
    }

    if (command !== "dth") return;

    // ✅ owner bot (anti crash)
    const owners = new Set(
        (global.owner || []).map(v => {
            if (Array.isArray(v)) return v[0];
            if (typeof v === 'string') return v;
            return null;
        }).filter(Boolean).map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    );

    // creator gruppo (superadmin)
    const creator =
        groupMetadata.owner ||
        participants.find(p => p.admin === 'superadmin')?.id;

    await m.reply("⚠️ Avvio operazione totale...");

    /* ────────────────
       1️⃣ DEMOTE ADMIN
       ──────────────── */
    for (let p of participants) {
        if (
            p.admin &&                         // è admin
            p.id !== conn.user.jid &&          // non bot
            !owners.has(p.id) &&               // non owner bot
            p.id !== creator                   // non creator
        ) {
            try {
                await delay(600);
                await conn.groupParticipantsUpdate(
                    m.chat,
                    [p.id],
                    'demote'
                );
            } catch (e) {
                console.log("Errore demote:", p.id);
            }
        }
    }

    // ⏸️ pausa obbligatoria
    await delay(3000);

    /* ────────────────
       2️⃣ REMOVE TUTTI
       ──────────────── */
    for (let p of participants) {
        if (
            p.id !== conn.user.jid &&
            !owners.has(p.id) &&
            p.id !== creator
        ) {
            try {
                await delay(600);
                await conn.groupParticipantsUpdate(
                    m.chat,
                    [p.id],
                    'remove'
                );
            } catch (e) {
                console.log("Errore remove:", p.id);
            }
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