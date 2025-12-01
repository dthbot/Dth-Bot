import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Path fix per ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files
const ENABLED_FILE = path.join(__dirname, "enabledGroups.json");
const CONFIG_FILE = path.join(__dirname, "config.json");

// Carica config
let CONFIG = { owners: [], botNumbers: [], demoteDelayMs: 600 };
try {
    CONFIG = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
} catch (e) {
    console.warn("Config non trovata, uso valori di default.");
}

// Helpers
function loadEnabled() {
    try {
        return JSON.parse(fs.readFileSync(ENABLED_FILE, "utf8"));
    } catch {
        return [];
    }
}
function saveEnabled(list) {
    fs.writeFileSync(ENABLED_FILE, JSON.stringify(list, null, 2));
}
function addEnabled(jid) {
    const list = loadEnabled();
    if (!list.includes(jid)) {
        list.push(jid);
        saveEnabled(list);
    }
}
function removeEnabled(jid) {
    const list = loadEnabled().filter(x => x !== jid);
    saveEnabled(list);
}
function isEnabled(jid) {
    return loadEnabled().includes(jid);
}

const wait = (ms) => new Promise(res => setTimeout(res, ms));

// EXPORT versione ESM
export default function registerAntiAdminPlugin(sock) {

    // Comandi
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m?.message || m.key.fromMe) return;

        const jid = m.key.remoteJid;
        if (!jid.endsWith("@g.us")) return;

        const sender = m.key.participant ?? m.key.remoteJid;
        const text =
            m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            "";

        if (text.trim() === ".420") {
            const md = await sock.groupMetadata(jid);
            const isAdmin = md.participants.find(p => p.id === sender)?.admin;
            const isOwner = CONFIG.owners.includes(sender);

            if (!isAdmin && !isOwner) {
                await sock.sendMessage(jid, {
                    text: "Solo owner o admin possono attivare .420."
                });
                return;
            }

            addEnabled(jid);

            await sock.sendMessage(jid, { text: "🟢 Protezione .420 ATTIVATA." });

            enforce(jid, sock);
        }

        if (text.trim() === ".420sban") {
            removeEnabled(jid);
            await sock.sendMessage(jid, { text: "🔴 Protezione .420 DISATTIVATA." });
        }
    });

    // Eventi admin
    sock.ev.on("group-participants.update", async (update) => {
        if (!isEnabled(update.id)) return;

        if (["promote", "demote", "add", "remove"].includes(update.action)) {
            await enforce(update.id, sock);
        }
    });

    // Funzione principale di antinuke
    async function enforce(groupJid, sock) {
        try {
            const md = await sock.groupMetadata(groupJid);
            const me = sock.user?.id;

            const admins = md.participants.filter(p => p.admin);

            // Controllo se bot è admin
            const botAdmin = admins.some(a => a.id === me);
            if (!botAdmin) {
                await sock.sendMessage(groupJid, {
                    text: "⚠ Il bot NON è admin → impossibile applicare la protezione."
                });
                return;
            }

            const protectedIDs = new Set([
                ...CONFIG.owners,
                ...CONFIG.botNumbers,
                me
            ]);

            const toDemote = admins
                .map(a => a.id)
                .filter(id => !protectedIDs.has(id));

            for (const target of toDemote) {
                try {
                    await sock.groupParticipantsUpdate(groupJid, [target], "demote");
                    await wait(CONFIG.demoteDelayMs);
                } catch (err) {
                    console.error("Errore demote:", err);
                }
            }

            if (toDemote.length > 0) {
                await sock.sendMessage(groupJid, {
                    text: `🔒 Protezione .420 attiva: rimossi ${toDemote.length} admin non autorizzati.`
                });
            }

        } catch (err) {
            console.error("Errore ENFORCE:", err);
        }
    }
}
