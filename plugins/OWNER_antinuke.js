// ===== Bagley 2.0 AntiNuke + AntiKick Plugin (CORRETTO) =====
// Comandi: .420 -> attiva | .420sban -> disattiva
// Solo admin del gruppo possono usare i comandi
// Blocca: promozioni/democrazioni non autorizzate, kick e rejoin automatico

import fs from 'fs';

const ANTINUKE_FILE = './config/antinuke.json';
if (!fs.existsSync(ANTINUKE_FILE)) fs.writeFileSync(ANTINUKE_FILE, '{}');

const OWNERS = [
  '+6285134977074@s.whatsapp.net',
  '+212621266387@s.whatsapp.net'
];

function loadAntinuke() {
  return JSON.parse(fs.readFileSync(ANTINUKE_FILE));
}
function saveAntinuke(data) {
  fs.writeFileSync(ANTINUKE_FILE, JSON.stringify(data, null, 2));
}

export default function setupAntiNuke(sock) {

  // ==================== COMANDI ====================
  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || !msg.key.remoteJid?.endsWith('@g.us')) continue;
      let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
      if (!text) continue;

      // Traduci .420 e .420sban in comandi interni
      if (text === '.420') text = 'antinuke on';
      else if (text === '.420sban') text = 'antinuke off';

      if (text.startsWith('antinuke')) {
        const args = text.split(' ');
        const action = args[1]?.toLowerCase();
        if (!msg.meta?.isAdmin) {
          await sock.sendMessage(msg.key.remoteJid, { text: `❌ Solo gli admin possono gestire l'AntiNuke.` });
          continue;
        }
        const antinukeData = loadAntinuke();
        if (action === 'on') {
          antinukeData[msg.key.remoteJid] = true;
          saveAntinuke(antinukeData);
          await sock.sendMessage(msg.key.remoteJid, { text: '🛡️ AntiNuke ATTIVATO.' });
        } else if (action === 'off') {
          delete antinukeData[msg.key.remoteJid];
          saveAntinuke(antinukeData);
          await sock.sendMessage(msg.key.remoteJid, { text: '🟡 AntiNuke DISATTIVATO.' });
        }
      }
    }
  });

  // ==================== ANTI-ADMIN ====================
  sock.ev.on('group-participants.update', async (update) => {
    const group = update.id;
    const antinukeData = loadAntinuke();
    if (!antinukeData[group]) return;

    const metadata = await sock.groupMetadata(group);
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';

    // PROMOTE / DEMOTE non autorizzati
    if (update.action === 'promote' || update.action === 'demote') {
      for (const p of metadata.participants) {
        const jid = p.id;
        const isAdmin = p.admin !== null;
        if (isAdmin && jid !== botId && !OWNERS.includes(jid)) {
          try {
            await sock.groupParticipantsUpdate(group, [jid], 'demote');
          } catch (err) { console.log('Errore demote:', err); }
        }
      }
      await sock.sendMessage(group, { text: '⚠️ AntiNuke: modifiche admin bloccate.' });
    }

    // ANTI-KICK
    if (update.action === 'remove') {
      const kicker = update.actor;
      const victim = update.participants[0];
      if (!victim || victim === botId) return;

      // Reinserisci la vittima
      try { await sock.groupParticipantsUpdate(group, [victim], 'add'); } catch {}
      // Demote chi ha kikkato se non owner o bot
      if (kicker && kicker !== botId && !OWNERS.includes(kicker)) {
        try { await sock.groupParticipantsUpdate(group, [kicker], 'demote'); } catch {}
      }
      await sock.sendMessage(group, { text: `🚨 AntiKick: @${victim.split('@')[0]} reinserito, colpevole demotato.`, mentions: [victim] });
    }
  });
}
