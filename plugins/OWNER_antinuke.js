import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// CONFIGURAZIONE CHIAVI
// Sostituire con i JID completi (@s.whatsapp.net)
const OWNERS = [
  "+6285134977074@s.whatsapp.net",
  "+212621266387@s.whatsapp.net"
];

const BOT_NUMBERS = [
  "+19703033177@s.whatsapp.net",
  "+6281917478560@s.whatsapp.net"
];

// File per la persistenza dello stato
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const enabledFile = path.join(__dirname, 'enabledGroups.json');

// --- FUNZIONI DI GESTIONE STATO ---
function loadGroups() {
  if (!fs.existsSync(enabledFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(enabledFile, 'utf-8'));
  } catch (e) {
    console.error("Errore nel parsing di enabledGroups.json:", e);
    return [];
  }
}

function saveGroups(list) {
  fs.writeFileSync(enabledFile, JSON.stringify(list, null, 2), 'utf-8');
}

// --- FUNZIONE DI DIFESA ANTI-NUKE (Logica) ---
async function defenseProtocol(sock, from, msg) {
    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants;

    let demotedCount = 0;
    
    // Filtra e prepara i partecipanti da demotare
    const targets = participants.filter(p => {
        const jid = p.id;
        const isAdmin = p.admin !== null;
        
        // Se è admin E NON è Owner E NON è Bot
        return isAdmin && !OWNERS.includes(jid) && !BOT_NUMBERS.includes(jid);
    }).map(p => p.id); // Estrae solo i JID

    if (targets.length === 0) return;
    
    console.log(`[ANTI-NUKE] Rilevato cambio admin in ${from}. Demoto ${targets.length} admin.`);

    // Esegue il demote per tutti i target
    for (const jid of targets) {
        try {
            await sock.groupParticipantsUpdate(from, [jid], 'demote');
            demotedCount++;
        } catch (err) {
            console.log(`Errore demote per ${jid}:`, err);
        }
    }
    
    // Notifica l'azione
    if (demotedCount > 0) {
        await sock.sendMessage(from, { 
            text: `🚨 *ANTI-NUKE ATTIVATO!* 🚨\nQualcuno ha promosso o retrocesso un admin. Demotati *${demotedCount}* amministratori esterni (Owner e Bot esclusi).` 
        });
    }
}

// --- HANDLER PRINCIPALE (Logica di Comando e Stato) ---
async function handler(m, { conn: sock, usedPrefix, command }) {
    const msg = m; // Usiamo m come alias per msg (convenzione handler)
    const key = msg.key;
    const from = key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    
    if (!isGroup) return;

    let enabledGroups = loadGroups();
    const isEnabled = enabledGroups.includes(from);
    const body = m.text; // Utilizziamo m.text per l'input completo
    
    // --- 1. Logica di Comando con Bottoni (.antinuke o .420) ---
    if (command === 'antinuke' || command === '420') {
        
        // Controlla se l'utente è Owner (necessario per attivare/disattivare)
        const sender = key.participant || key.remoteJid;
        if (!OWNERS.includes(sender)) {
            return sock.sendMessage(from, { text: '❌ Solo i numeri Owner possono gestire AntiNuke.' }, { quoted: msg });
        }
        
        const statusIcon = isEnabled ? '🟢' : '🔴';
        const statusText = isEnabled ? 'Attivo' : 'Disattivo';
        
        // Messaggio con Bottoni
        const buttons = [
            { buttonId: `${usedPrefix}antinuke_attiva`, buttonText: { displayText: '🟢 Attiva AntiNuke' }, type: 1 },
            { buttonId: `${usedPrefix}antinuke_disattiva`, buttonText: { displayText: '🔴 Disattiva AntiNuke' }, type: 1 }
        ];

        const buttonMessage = {
            text: `🛡️ **Stato AntiNuke:** *${statusIcon} ${statusText}*\n\nSe Attivo, rimuoverà tutti gli admin del gruppo (eccetto Owner e Bot) quando viene rilevato un cambio di ruolo admin.`,
            footer: 'Seleziona un\'opzione:',
            buttons: buttons,
            headerType: 1
        };

        return sock.sendMessage(from, buttonMessage, { quoted: msg });
    }

    // --- 2. Logica di Attivazione/Disattivazione (tramite bottoni) ---
    // Usiamo comandi basati sul prefisso per intercettare la pressione del bottone
    if (command === 'antinuke_attiva' || command === 'antinuke_disattiva') {
        const sender = key.participant || key.remoteJid;
        if (!OWNERS.includes(sender)) return; // Controllo owner

        if (command === 'antinuke_attiva' && !isEnabled) {
            enabledGroups.push(from);
            saveGroups(enabledGroups);
            return sock.sendMessage(from, { text: '✅ AntiNuke Attivato! Il bot ora monitorerà il gruppo.' }, { quoted: msg });
        } else if (command === 'antinuke_disattiva' && isEnabled) {
            enabledGroups = enabledGroups.filter(g => g !== from);
            saveGroups(enabledGroups);
            // 🛑 ERRORE DI SINTASSI CORRETTO QUI 🛑
            return sock.sendMessage(from, { text: '❌ AntiNuke Disattivato. Il gruppo è di nuovo vulnerabile.' }, { quoted: msg });
        }
        return;
    }
}

// --- FUNZIONE ASINCRONA PER EVENTI FUORI DALL'HANDLER ---
// Questa funzione intercetta gli eventi di promozione/retrocessione (messageStubType)
export async function antiAdminNukeEvent(sock, msg) {
    const { key, messageStubType } = msg;
    const from = key.remoteJid;
    const isGroup = from && from.endsWith('@g.us');
    
    if (!isGroup) return;
    
    const enabledGroups = loadGroups();
    const isEnabled = enabledGroups.includes(from);

    // 3. Logica di Difesa (Rilevamento Evento)
    if (isEnabled) {
        // messageStubType 1: Promozione Admin 
        // messageStubType 2: Retrocessione Admin
        // Utilizziamo anche altri stub type comuni per gli eventi di gruppo
        if (messageStubType === 1 || messageStubType === 2 || messageStubType === 32 || messageStubType === 33) {
            await defenseProtocol(sock, from, msg);
        }
    }
}

// --- ESPORTAZIONE PER IL SISTEMA DI PLUGIN ---
handler.command = ['antinuke', '420', 'antinuke_attiva', 'antinuke_disattiva'];
handler.tags = ['owner'];
handler.help = ['.antinuke', '.420'];
export default handler;
