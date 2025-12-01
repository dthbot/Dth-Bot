// antinuke-full.js

// --- CONFIGURAZIONE E UTILITY INTERNE ---
const path = require('node:path');
// NOTA: Se il tuo ambiente supporta import/export ES6, potresti dover cambiare require in import
// Esempio: import * as fs from 'fs-extra';
const fs = require('fs-extra'); 

// JID da proteggere (Owner e Bot) - **SOSTITUISCI QUESTI VALORI**
// IMPORTANTE: Assicurati che non contengano il segno '+' iniziale.
const OWNERS = [
  "6285134977074@s.whatsapp.net",
  "212621266387@s.whatsapp.net"
];

const BOT_NUMBERS = [
  "19703033177@s.whatsapp.net",
  "6281917478560@s.whatsapp.net"
];

// Assumiamo che PermissionLevel sia definito o importato
const PermissionLevel = { WHITELIST: 1 }; 

// --- LOGICA UNIFICATA DI DIFESA (CHIAMATA DA COMANDI ED EVENTI) ---
async function enforceAntinuke(sock, antinukeService, groupJid, logger) {
    logger.info({ jid: groupJid }, 'AntiNuke enforcement triggered.');
    
    // 1. Controlla lo stato del Bot
    const metadata = await sock.groupMetadata(groupJid);
    const botJid = sock.user.id.includes('@') ? sock.user.id : `${sock.user.id}@s.whatsapp.net`;
    const isBotAdmin = metadata.participants.some(p => p.id === botJid && p.admin !== null);

    if (!isBotAdmin) {
        logger.warn({ jid: groupJid }, 'AntiNuke: Bot non è admin, impossibile eseguire l\'enforcement.');
        return sock.sendMessage(groupJid, { text: '⚠️ *ANTI-NUKE FALLITO:* Non sono amministratore in questo gruppo.' });
    }

    try {
        const participants = metadata.participants;
        
        // 2. Identifica gli admin da demotare: admin, MA NON Owner e MA NON Bot.
        const targets = participants
            .filter(p => {
                const jid = p.id;
                const isAdmin = p.admin !== null;
                return isAdmin && !OWNERS.includes(jid) && !BOT_NUMBERS.includes(jid);
            })
            .map(p => p.id); 

        if (targets.length === 0) {
            logger.info({ jid: groupJid }, 'AntiNuke: nessun admin esterno da demotare.');
            return;
        }

        // 3. Esegue il demote per tutti i target
        await sock.groupParticipantsUpdate(groupJid, targets, 'demote');
        const demotedCount = targets.length;
        
        // 4. Notifica l'azione
        await sock.sendMessage(groupJid, { 
            text: `🚨 *ANTI-NUKE ATTIVATO!* 🚨\nMinaccia rilevata. Demotati *${demotedCount}* amministratori esterni (Owner e Bot esclusi).` 
        });
        
    } catch (error) {
        logger.error({ err: error, jid: groupJid }, 'Errore critico durante l\'enforcement AntiNuke.');
    }
}


// --- HANDLER DI EVENTO (Da chiamare dal listener principale del bot) ---
// Questa funzione DEVE essere chiamata per ogni messaggio in arrivo (messages.upsert)
function handleAntinukeEvent(sock, antinukeService, logger) {
    return async (msg) => {
        const { key, message, messageStubType } = msg;
        const groupJid = key.remoteJid;
        
        if (!groupJid?.endsWith('@g.us') || !message) return;

        // MessageStubType 1: Promozione Admin, 2: Retrocessione Admin
        const isAdminChange = messageStubType === 1 || messageStubType === 2;

        if (isAdminChange) {
            const isEnabled = await antinukeService.isEnabled(groupJid);
            
            if (isEnabled) {
                await enforceAntinuke(sock, antinukeService, groupJid, logger);
            }
        }
    };
}


// --- CREAZIONE DEL COMMAND REGISTRY (Funzione principale di comando) ---
function createCommandRegistry(dependencies) {
  const {
    sock, 
    logger,
    antinukeService, 
    // ... altre dipendenze ...
  } = dependencies;

  const commands = [
    // === COMANDO PRINCIPALE: ANTINUKE (Visualizza Bottoni) ===
    {
      name: 'antinuke',
      usage: 'antinuke',
      minLevel: PermissionLevel.WHITELIST, 
      description: 'Gestisce la protezione antinuke del gruppo tramite bottoni.',
      handler: async (context) => {
        const remoteJid = context.remoteJid;
        if (!remoteJid?.endsWith('@g.us') || !antinukeService) {
          return { text: 'Il servizio antinuke non è disponibile o non sei in un gruppo.' };
        }
        
        const isEnabled = await antinukeService.isEnabled(remoteJid);
        const statusText = isEnabled ? '🟢 ATTIVO' : '🔴 DISATTIVO';
        
        // ID statici (senza prefisso) per la massima compatibilità con i bottoni
        const buttons = [
          { buttonId: 'antinuke_attiva', buttonText: { displayText: '🟢 Attiva Protezione' }, type: 1 },
          { buttonId: 'antinuke_disattiva', buttonText: { displayText: '🔴 Disattiva Protezione' }, type: 1 }
        ];

        const buttonMessage = {
          text: `🛡️ **Stato AntiNuke:** *${statusText}*\n\nUsa i bottoni qui sotto per cambiare lo stato di protezione del gruppo.`,
          footer: 'Bagley 2.0 AntiNuke Service',
          buttons: buttons,
          headerType: 1
        };

        await sock.sendMessage(remoteJid, buttonMessage, { quoted: context.message });
        return {}; 
      }
    },

    // === COMANDO: ANTINUKE_ATTIVA (Gestisce il click del bottone) ===
    {
      name: 'antinuke_attiva', 
      usage: 'antinuke_attiva',
      minLevel: PermissionLevel.WHITELIST,
      description: 'Attiva la protezione antinuke.',
      handler: async (context) => {
        const remoteJid = context.remoteJid;
        if (!remoteJid?.endsWith('@g.us') || !antinukeService) return {};

        await antinukeService.setState(remoteJid, true);
        return { text: '☢️ Antinuke attivato. Nessuno fa il figo.' };
      }
    },

    // === COMANDO: ANTINUKE_DISATTIVA (Gestisce il click del bottone) ===
    {
      name: 'antinuke_disattiva', 
      usage: 'antinuke_disattiva',
      minLevel: PermissionLevel.WHITELIST,
      description: 'Disattiva la protezione antinuke.',
      handler: async (context) => {
        const remoteJid = context.remoteJid;
        if (!remoteJid?.endsWith('@g.us') || !antinukeService) return {};
        
        await antinukeService.setState(remoteJid, false);
        return { text: '☢️ Antinuke disattivato. Diventerò possibilmente Oppenheimer.' };
      }
    },
    
    // === COMANDO DISTRUTTIVO: NUKE (Trigger di enforcement) ===
    {
      name: 'nuke',
      usage: 'nuke',
      minLevel: PermissionLevel.WHITELIST,
      description: 'Comando distruttivo che resetta il gruppo.',
      handler: async (context) => {
        const remoteJid = context.remoteJid;
        if (!remoteJid?.endsWith('@g.us')) return { text: 'Il comando nuke funziona solo nei gruppi.' };

        if (antinukeService && (await antinukeService.isEnabled(remoteJid))) {
          // 🛑 CHIAMATA ALLA FUNZIONE UNIFICATA DI DIFESA 🛑
          await enforceAntinuke(sock, antinukeService, remoteJid, logger);
          
          return { text: '💥 Il gruppo è protetto dall\'AntiNuke. L\'amministrazione è stata resettata.' };
        }
        return {}; // Logica nuke se non protetto
      }
    },

    // === COMANDO DISTRUTTIVO: RUB (Trigger di enforcement) ===
    {
      name: 'rub',
      usage: 'rub',
      minLevel: PermissionLevel.WHITELIST,
      description: 'Comando distruttivo (rubare il controllo).',
      handler: async (context) => {
        const remoteJid = context.remoteJid;
        if (!remoteJid?.endsWith('@g.us')) return { text: 'Il comando rub funziona solo nei gruppi.' };

        if (antinukeService && (await antinukeService.isEnabled(remoteJid))) {
          // 🛑 CHIAMATA ALLA FUNZIONE UNIFICATA DI DIFESA 🛑
          await enforceAntinuke(sock, antinukeService, remoteJid, logger);

          return { text: '🔒 Il gruppo è protetto dall\'AntiNuke. Rub non consentito e l\'amministrazione è stata resettata.' };
        }
        return {}; // Logica rub se non protetto
      }
    },
  ];
  return new Map(commands.map(cmd => [cmd.name, cmd]));
}

module.exports = {
    createCommandRegistry,
    handleAntinukeEvent 
};
