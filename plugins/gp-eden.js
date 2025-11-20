// eden.js
// Plugin Baileys - Comando .eden (versione 2)
// Invia un messaggio protettivo su Eden

const makeWASocket = require('@adiwajshing/baileys').default;
const { useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');
const pino = require('pino');

const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json');

async function start() {
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 10] }));
  const sock = makeWASocket({
    logger: pino({ level: 'info' }),
    printQRInTerminal: true,
    auth: state,
    version
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) start();
      else console.log('Disconnesso. Cancella auth_info_multi.json per rifare il login.');
    } else if (connection === 'open') {
      console.log('✅ Plugin eden attivo.');
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (!m.messages || m.type !== 'notify') return;
      const msg = m.messages[0];
      if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

      const from = msg.key.remoteJid;
      // accetta sia chat singole che gruppi
      // il sender lo usiamo solo per quoting/mentions se servisse
      const sender = msg.key.participant || msg.key.remoteJid;

      let text = msg.message.conversation ||
                 msg.message.extendedTextMessage?.text ||
                 msg.message.imageMessage?.caption ||
                 '';
      text = (text || '').trim().toLowerCase();

      if (text !== '.eden') return;

      const message = 'Eden è una delle persone più belle e gentili che conosco porco dio lasciatela stare sennò vi uccido ora non mi vuole neanche più bene😎';
      await sock.sendMessage(from, { text: message }, { quoted: msg });

    } catch (err) {
      console.error('Errore nel plugin eden:', err);
    }
  });
}

start().catch(e => console.error(e));
