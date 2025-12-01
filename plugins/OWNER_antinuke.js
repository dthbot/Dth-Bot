// OWNER_antinuke.js (versione ESM)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENABLED_FILE = path.join(__dirname, 'enabledGroups.json');
const CONFIG_FILE = path.join(__dirname, 'config.json');

// Carica config
let CONFIG = { owners: [], botNumbers: [], demoteDelayMs: 600 };
try {
  CONFIG = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
} catch (e) {
  console.warn('Config non trovata, uso valori di default.');
}

function loadEnabled() {
  try {
    return JSON.parse(fs.readFileSync(ENABLED_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}
function saveEnabled(list) {
  fs.writeFileSync(ENABLED_FILE, JSON.stringify(list, null, 2));
}
function addEnabled(jid) {
  const l = loadEnabled();
  if (!l.includes(jid)) { l.push(jid); saveEnabled(l); }
}
function removeEnabled(jid) {
  let l = loadEnabled().filter(x => x !== jid);
  saveEnabled(l);
}
function isEnabled(jid) {
  return loadEnabled().includes(jid);
}

const wait = ms => new Promise(r => setTimeout(r, ms));

export default function registerAntiAdminPlugin(sock) {

  // comandi del bot
  sock.ev.on('messages.upsert', async (mup) => {
    const msgs = mup.messages || [];
    for (const m of msgs) {
      if (!m.message || m.key.fromMe) continue;

      const jid = m.key.remoteJid;
      if (!jid.endsWith('@g.us')) continue;

      const sender = m.key.participant || m.key.remoteJid;

      const text = (m.message.conversation ||
                    m.message.extendedTextMessage?.text ||
                    '').trim();

      if (text === '.420') {
        const md = await sock.groupMetadata(jid);
        const isAdmin = md.participants.find(p => p.id === sender)?.admin;
        const isOwner = CONFIG.owners.includes(sender);

        if (!isOwner && !isAdmin) {
          sock.sendMessage(jid, { text: "Solo owner del bot o admin del gruppo possono attivare .420." }, { quoted: m });
          continue;
        }

        addEnabled(jid);
        sock.sendMessage(jid, { text: "🟢 Protezione .420 ATTIVATA." }, { quoted: m });

        enforceDemote(jid, sock);
      }

      if (text === '.420sban') {
        const md = await sock.groupMetadata(jid);
        const isAdmin = md.participants.find(p => p.id === sender)?.admin;
        const isOwner = CONFIG.owners.includes(sender);

        if (!isOwner && !isAdmin) {
          sock.sendMessage(jid, { text: "Solo owner del bot o admin del gruppo possono disattivare .420." }, { quoted: m });
          continue;
        }

        removeEnabled(jid);
        sock.sendMessage(jid, { text: "🔴 Protezione .420 DISATTIVATA." }, { quoted: m });
      }
    }
  });

  // ascolta cambi admin
  sock.ev.on('group-participants.update', async (u) => {
    if (!isEnabled(u.id)) return;
    if (['promote', 'demote', 'add', 'remove'].includes(u.action)) {
      await enforceDemote(u.id, sock);
    }
  });

  // funzione che demota tutti tranne owner e bot
  async function enforceDemote(groupJid, sockInstance) {
    const md = await sockInstance.groupMetadata(groupJid);
    const meId = sockInstance.user?.id;

    const admins = md.participants.filter(p => p.admin);

    const botIsAdmin = admins.some(a => a.id === meId);
    if (!botIsAdmin) {
      sockInstance.sendMessage(groupJid, { text: "⚠ Protezione .420 attiva, ma il bot NON è admin." });
      return;
    }

    const protectedIDs = new Set([
      ...CONFIG.owners,
      ...CONFIG.botNumbers,
      meId
    ]);

    const toDemote = admins
      .map(a => a.id)
      .filter(id => !protectedIDs.has(id));

    if (toDemote.length === 0) return;

    for (const id of toDemote) {
      try {
        await sockInstance.groupParticipantsUpdate(groupJid, [id], 'demote');
        await wait(CONFIG.demoteDelayMs);
      } catch (e) {
        console.log("Errore demote:", e);
      }
    }

    sockInstance.sendMessage(groupJid, { text: `🔒 Protezione .420 attiva: rimossi i privilegi admin da ${toDemote.length} utenti.` });
  }

  return { isEnabled, addEnabled, removeEnabled };
}
