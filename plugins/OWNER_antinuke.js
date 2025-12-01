// Plugin Anti-Admin Nuke — Compatibile ES Module
// Comandi: .420 (attiva) | .420sban (disattiva)
// Funzione: se qualcuno promuove o retrocede un admin, il bot rimuove tutti gli admin
// tranne gli owner e i numeri bot.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OWNER
const OWNERS = [
  "+6285134977074@s.whatsapp.net",
  "+212621266387@s.whatsapp.net"
];

// BOT
const BOT_NUMBERS = [
  "+19703033177@s.whatsapp.net",
  "+6281917478560@s.whatsapp.net"
];

// File con gruppi attivati
const enabledFile = path.join(__dirname, 'enabledGroups.json');

function loadGroups() {
  if (!fs.existsSync(enabledFile)) return [];
  return JSON.parse(fs.readFileSync(enabledFile));
}

function saveGroups(list) {
  fs.writeFileSync(enabledFile, JSON.stringify(list, null, 2));
}

export default async function antiAdminNuke(sock, msg) {
  try {
    const { key, message, messageStubType } = msg;
    if (!message) return;

    const from = key.remoteJid;
    if (!from.endsWith('@g.us')) return;

    const body = message?.conversation || message?.extendedTextMessage?.text || '';

    let enabled = loadGroups();

    // Attiva
    if (body === '.420') {
      if (!enabled.includes(from)) enabled.push(from);
      saveGroups(enabled);

      await sock.sendMessage(from, { text: '🟢 AntiNuke ATTIVATO per questo gruppo.' });
      return;
    }

    // Disattiva
    if (body === '.420sban') {
      enabled = enabled.filter(g => g !== from);
      saveGroups(enabled);

      await sock.sendMessage(from, { text: '🔴 AntiNuke DISATTIVATO per questo gruppo.' });
      return;
    }

    // Non attivo → stop
    if (!enabled.includes(from)) return;

    // Eventi di promozione o retrocessione
    if (messageStubType === 1 || messageStubType === 2) {
      const metadata = await sock.groupMetadata(from);
      const participants = metadata.participants;

      for (const p of participants) {
        const jid = p.id;
        const isAdmin = p.admin !== null;

        // Demota tutto tranne bot e owner
        if (isAdmin && !OWNERS.includes(jid) && !BOT_NUMBERS.includes(jid)) {
          try {
            await sock.groupParticipantsUpdate(from, [jid], 'demote');
          } catch (err) {
            console.log('Errore demote:', err);
          }
        }
      }
    }

  } catch (err) {
    console.log('Errore Anti-Admin:', err);
  }
}
