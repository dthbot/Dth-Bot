                // =======================
//   ANTI NUKE SYSTEM
// =======================

const owners = ["27663845778@s.whatsapp.net", "212621266387@s.whatsapp.net"]; 
const founders = ["27663845778@s.whatsapp.net"];

let antiNuke = false;

let handler = async (m, { conn, command, text }) => {
    if (command === "antinuke") {

        let option = text?.trim().toLowerCase(); // <-- FUNZIONA SEMPRE

        if (option === "on") {
            antiNuke = true;
            return m.reply("🛡️ *AntiNuke attivato!*");
        }

        if (option === "off") {
            antiNuke = false;
            return m.reply("❌ *AntiNuke disattivato!*");
        }

        return m.reply("Usa:\n• *.antinuke on*\n• *.antinuke off*");
    }
};

// ==========================================
//            SISTEMA ANTI-NUKE
// ==========================================
handler.before = async (m, { conn }) => {
    if (!antiNuke) return;
    if (!m.isGroup) return;
    if (!m.messageStubType) return;

    try {
        let metadata = await conn.groupMetadata(m.chat);
        let participants = metadata.participants;
        let botJid = conn.user.jid;

        let whitelist = [...owners, ...founders, botJid];

        // 1️⃣ RIMOZIONE ADMIN
        if (m.messageStubType === 29) {
            let admins = participants.filter(p => p.admin);
            let botAdmin = admins.some(a => a.id === botJid);
            if (!botAdmin) return;

            let toDemote = admins
                .map(a => a.id)
                .filter(id => !whitelist.includes(id));

            if (toDemote.length > 0) {
                await conn.sendMessage(m.chat, { text: "🚨 *AntiNuke:* rilevata rimozione admin!" });
                await conn.groupParticipantsUpdate(m.chat, toDemote, "demote");
                await conn.sendMessage(m.chat, { text: "🛡️ *Solo Owner, Founder e Bot restano admin.*" });
            }
        }

        // 2️⃣ MASS-KICK (3 persone rimosse)
        if (m.messageStubType === 28) {
            let removed = m.messageStubParameters;

            if (removed.length >= 3) {
                let admins = participants.filter(p => p.admin);
                let toDemote = admins
                    .map(a => a.id)
                    .filter(id => !whitelist.includes(id));

                await conn.sendMessage(m.chat, { text: "🚨 *ATTACCO MASS-KICK RILEVATO!* Chiudo il gruppo." });

                // Chiudi gruppo
                await conn.groupSettingUpdate(m.chat, "announcement");

                // Rimuovi admin non autorizzati
                if (toDemote.length > 0) {
                    await conn.groupParticipantsUpdate(m.chat, toDemote, "demote");
                }

                await conn.sendMessage(m.chat, { text: "🔒 *Gruppo chiuso.* Solo Owner, Founder e Bot sono admin." });
            }
        }

    } catch (e) {
        console.log("ERRORE ANTI-NUKE:", e);
    }
};

export default handler;
