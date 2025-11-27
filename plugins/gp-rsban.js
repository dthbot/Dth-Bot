// rsban.js avanzato + kick reale + senza owner

const makeWASocket = require('@adiwajshing/baileys').default;
const { useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');
const pino = require('pino');
const fs = require('fs-extra');

const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json');

function formatToJid(raw) {
  if (!raw) return null;
  const clean = raw.replace(/[^\d+]/g, '');
  const digits = clean.startsWith('+') ? clean.slice(1) : clean;
  return `${digits}@s.whatsapp.net`;
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function start() {
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 10] }));
  const sock = makeWASocket({
    logger: pino({ level: 'info' }),
    printQRInTerminal: true,
    auth: state,
    version
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', async update => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) start();
      else console.log("Login scaduto: cancella auth_info_multi.json.");
    } else if (connection === 'open') {
      console.log("🔥 Plugin RSBAN con kick attivo (senza owner).");
    }
  });

  sock.ev.on('messages.upsert', async m => {
    try {
      if (!m.messages || m.type !== 'notify') return;

      const msg = m.messages[0];
      if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

      const from = msg.key.remoteJid;
      if (!from.endsWith('@g.us')) return;

      const sender = msg.key.participant || msg.key.remoteJid;

      let text = msg.message.conversation ||
                 msg.message.extendedTextMessage?.text ||
                 msg.message.imageMessage?.caption ||
                 '';
      text = text.trim().toLowerCase();

      // 🔹 Comando
      if (text !== '.rsban') return;

      // 🔹 Metadata e permessi
      const metadata = await sock.groupMetadata(from);

      const admins = metadata.participants
        .filter(p => p.admin)
        .map(p => p.id);

      const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
      const botIsAdmin = admins.includes(botId);

      // 🔹 Solo admin del gruppo possono usare il comando
      const isAdmin = admins.includes(sender);

      if (!isAdmin) {
        return await sock.sendMessage(from, { text: "🚫 Solo gli admin possono usare questo comando." }, { quoted: msg });
      }

      if (!botIsAdmin) {
        return await sock.sendMessage(from, { text: "⚠️ Non posso kikkare nessuno perché non sono admin." });
      }

      // 🔹 Membri disponibili (escludendo bot)
      const allMembers = metadata.participants.map(p => p.id);
      const validMembers = allMembers.filter(m => m !== botId);

      if (validMembers.length === 0) {
        return await sock.sendMessage(from, { text: "😢 Nessun membro valido da selezionare." });
      }

      // 🔥 Animazione
      await sock.sendMessage(from, { text: "🎲 Avvio della roulette ban..." }, { quoted: msg });
      await delay(1000);

      await sock.sendMessage(from, { text: "🔄 Girando la ruota..." });
      await delay(1200);

      await sock.sendMessage(from, { text: "⏳ Sta per uscire un nome..." });
      await delay(1400);

      // 🔹 Scelta finale
      const chosen = validMembers[Math.floor(Math.random() * validMembers.length)];

      // 🔹 Non si possono kikkare admin del gruppo
      if (admins.includes(chosen)) {
        await sock.sendMessage(from, { text: "⚠️ La roulette ha estratto un admin... impossibile kikkarlo 😅" });
        return;
      }

      // 🔹 Messaggio finale prima del kick
      const finalMessage =
        `✨ 𝕀𝕝 𝕡𝕣𝕖𝕤𝕔𝕖𝕝𝕥𝕠 𝕡𝕖𝕣 𝕝𝕒 𝕣𝕠𝕦𝕝𝕖𝕥𝕥𝕖 𝕓𝕒𝕟 𝕕𝕖𝕝 𝕘𝕣𝕦𝕡𝕡𝕠 è:\n\n` +
        `👉 @${chosen.split('@')[0]}\n\n` +
        `💀 *Verrà espulso dal gruppo!*`;

      await sock.sendMessage(from, { text: finalMessage, mentions: [chosen] });
      await delay(1500);

      // 🔥 Kick reale
      await sock.groupParticipantsUpdate(from, [chosen], "remove");

      await sock.sendMessage(from, { text: "✅ Utente espulso con successo." });

    } catch (err) {
      console.error("Errore nel plugin RSBAN:", err);
    }
  });
}

start().catch(e => console.error(e));
