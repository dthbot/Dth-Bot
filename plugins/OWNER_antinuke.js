// src/group-event-enforcement.js

// JID da proteggere (Owner e Bot)
// Questi dovrebbero essere definiti globalmente o importati
const OWNERS = [
  // ... inserisci i JID Owner corretti senza + ...
];

const BOT_NUMBERS = [
  // ... inserisci i JID Bot corretti senza + ...
];


// --- Logica di Difesa Anti-Nuke (demote) ---
async function enforceAntinuke(sock, antinukeService, groupJid, logger) {
    logger.info({ jid: groupJid }, 'AntiNuke enforcement triggered by group event.');
    
    try {
        const metadata = await sock.groupMetadata(groupJid);
        const participants = metadata.participants;

        let demotedCount = 0;
        
        // Identifica gli admin da demotare: sono admin, MA NON Owner e MA NON Bot.
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

        // Esegue il demote per tutti i target
        for (const jid of targets) {
            try {
                await sock.groupParticipantsUpdate(groupJid, [jid], 'demote');
                demotedCount++;
            } catch (err) {
                logger.error({ err, jid }, 'AntiNuke: Errore durante il demote.');
            }
        }
        
        // Notifica l'azione
        if (demotedCount > 0) {
            await sock.sendMessage(groupJid, { 
                text: `🚨 *ANTI-NUKE ATTIVATO!* 🚨\nRilevato cambio admin. Demotati *${demotedCount}* amministratori esterni (Owner e Bot esclusi).` 
            });
        }
    } catch (error) {
        logger.error({ err: error, jid: groupJid }, 'Errore critico durante l\'enforcement AntiNuke.');
    }
}


// --- HANDLER DI EVENTO (Dove avviene l'intercettazione) ---
// Questa è la funzione che devi chiamare dal tuo listener principale (messaggi/eventi)
function createGroupEventHandler({ sock, antinukeService, logger }) {
    
    // Funzione che intercetta i messaggi in arrivo (che potrebbero contenere stubType)
    return async (msg) => {
        const { key, message, messageStubType } = msg;
        const groupJid = key.remoteJid;
        
        if (!groupJid?.endsWith('@g.us') || !message) return;

        // Ipotizziamo che messageStubType 1 e 2 siano Promozione/Retrocessione Admin
        const isAdminChange = messageStubType === 1 || messageStubType === 2;

        if (isAdminChange) {
            const isEnabled = await antinukeService.isEnabled(groupJid);
            
            if (isEnabled) {
                // Se l'AntiNuke è attivo, avvia la procedura di difesa
                await enforceAntinuke(sock, antinukeService, groupJid, logger);
            }
        }
        
        // Aggiungere qui altri listener di eventi di gruppo se necessario
    };
}

module.exports = {
    createGroupEventHandler,
    enforceAntinuke 
};
