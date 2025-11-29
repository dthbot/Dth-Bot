// =======================================================
// PLUGIN: fun-rsban.cjs
// Comando: .rsban
// Descrizione: Roulette Ban, seleziona un membro casuale del gruppo.
// =======================================================

/**
 * Esegue la "Roulette Ban": seleziona casualmente un membro del gruppo e prepara il messaggio.
 * @param {Array<Object>} partecipanti - La lista dei partecipanti del gruppo (es. ottenuta da chat.participants).
 * @param {string} clientId - L'ID dell'utente/bot che esegue lo script.
 * @returns {{messaggio: string, utenteTaggato: string}} - L'output da inviare.
 */
function rouletteBan(partecipanti, clientId) {
    // 1. Filtra i partecipanti per escludere il bot
    // La proprietà _serialized è l'ID completo e serializzato dell'utente (numero@c.us)
    const membriReali = partecipanti.filter(p => p.id._serialized !== clientId);

    if (membriReali.length === 0) {
        return { messaggio: "Non ci sono altri membri nel gruppo per eseguire la Roulette Ban.", utenteTaggato: "" };
    }

    // 2. Selezione casuale dell'indice
    const indiceCasuale = Math.floor(Math.random() * membriReali.length);
    
    // 3. Ottiene il membro selezionato
    const sfortunato = membriReali[indiceCasuale];
    
    // ID serializzato completo (es. 391234567890@c.us)
    const utenteTaggato = sfortunato.id._serialized; 

    // 4. MESSAGGIO FISSO richiesto (il secondo della lista originale) 🎲
    const messaggioFisso = "🎲 La pallina gira, il tamburo spara... **Tutti zitti!** La sorte è stata lanciata. Il nostro prossimo candidato alla pausa chat è...";
    
    // L'ID viene spezzato per rimuovere la parte "@c.us" e viene aggiunto al messaggio con "@" per il tagging visivo.
    return { 
        messaggio: `${messaggioFisso} @${utenteTaggato.split('@')[0]}`,
        utenteTaggato: utenteTaggato
    };
}

// =======================================================
// Funzione di gestione del messaggio del bot
// Assumendo che il tuo bot usi la libreria whatsapp-web.js
// =======================================================

async function handleRsBanCommand(client, msg) {
    // Il comando funziona solo nei gruppi
    if (msg.body === '.rsban' && msg.from.endsWith('@g.us')) { 
        
        const chat = await msg.getChat();
        
        // Verifica che sia un gruppo e che abbia la lista dei partecipanti
        if (chat.isGroup && chat.participants) {
            
            // L'ID del bot viene ottenuto da client.info.wid._serialized
            const result = rouletteBan(chat.participants, client.info.wid._serialized);

            if (result.utenteTaggato) {
                 // L'array 'mentions' è FONDAMENTALE per taggare l'utente correttamente in WhatsApp
                const mention = [result.utenteTaggato];

                await client.sendMessage(msg.from, result.messaggio, {
                    mentions: mention
                });

                // SE VUOI ESEGUIRE UN VERO BAN, DEVI SCOMMENTARE LA RIGA SOTTOSTANTE:
                // try {
                //     await chat.removeParticipants([result.utenteTaggato]);
                //     console.log(`Utente ${result.utenteTaggato} rimosso dal gruppo.`);
                // } catch (error) {
                //     console.error("Errore durante la rimozione dell'utente:", error);
                //     client.sendMessage(msg.from, "Non ho i permessi per rimuovere l'utente selezionato.");
                // }

            } else {
                 msg.reply(result.messaggio);
            }

        } else {
             msg.reply("Questo comando funziona solo nei gruppi.");
        }
    }
}

// Esporta la funzione in formato CommonJS (.cjs)
module.exports = { 
    handleRsBanCommand,
    rouletteBan // Esportiamo anche la funzione interna se dovesse servire
};
