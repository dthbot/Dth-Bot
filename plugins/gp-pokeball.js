// pokeball.js
// Plugin per admin - comando .pokeball
// Requisiti: @adiwajshing/baileys, pino, fs-extra

const makeWASocket = require('@adiwajshing/baileys').default;
const { useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');
const pino = require('pino');
const fs = require('fs-extra');

const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json');

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function start() {
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 2304, 10] }));
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
      console.log('Connesso ✅ (plugin pokeball attivo)');
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (!m.messages || m.type !== 'notify') return;
      const msg = m.messages[0];
      if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

      const from = msg.key.remoteJid;
      const isGroup = from.endsWith('@g.us');
      const sender = (msg.key.participant || msg.key.remoteJid) + '';

      let text = '';
      if (msg.message.conversation) text = msg.message.conversation;
      else if (msg.message.extendedTextMessage) text = msg.message.extendedTextMessage.text || '';
      else if (msg.message.imageMessage?.caption) text = msg.message.imageMessage.caption;
      text = (text || '').trim();

      if (text.toLowerCase() !== '.pokeball') return;
      if (!isGroup) {
        await sock.sendMessage(from, { text: `⚠️ Questo comando funziona solo nei gruppi!` });
        return;
      }

      // Controlla se l’utente è admin
      const metadata = await sock.groupMetadata(from);
      const participant = metadata.participants.find(p => p.id === sender);
      if (!participant?.isAdmin && !participant?.isSuperAdmin) {
        await sock.sendMessage(from, { text: `🚫 Solo gli admin possono evocare il Pokémon leggendario!` });
        return;
      }

      // Messaggio divertente
      const pokemonMsg = `
🎮 *POKÉMON DEL GRUPPO EVOCATO!* 🎮  

✨ Nome: *Axtral aka Pokémon di fiducia*  
💪 Classe: *Tipo Elettrico-Leggendario*  
😂 Abilità speciale: *Far ridere il gruppo anche alle 3 di notte!*  
🌍 Descrizione: questo esemplare raro appare solo quando un admin digita il comando segreto.  
💞 Missione: trovare una compagna allenatrice prima che arrivi la prossima stagione di Pokémon!  
⚡ Motto: “Se non sei pronto a ridere, non evocarmi sono troppo gay a spaventarmi!”  

Gotta tag ’em all! 😎
`;

      await sock.sendMessage(from, { text: pokemonMsg }, { quoted: msg });

    } catch (err) {
      console.error('Errore gestione messaggi pokemon.js:', err);
    }
  });
}

start().catch(e => console.error(e));
