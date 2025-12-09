/*
  =============================================================
  PLUGIN: fun-shop.js (Versione In-Memory)
  
  ATTENZIONE: Questa versione NON usa Firestore. I dati (portafoglio e inventario)
  verranno persi ogni volta che il bot viene riavviato.

  Logica:
  - Usa conn.shop per salvare l'inventario e il portafoglio di ogni utente.
  - Il portafoglio è fittizio (inizializzato a 10000).
  - L'handler cattura il comando iniziale (.shop) e le azioni dei pulsanti.
  - I pulsanti usano il pattern .shop <AZIONE> <ARGOMENTO> per il routing.
  =============================================================
*/

// =======================================================
// CONFIGURAZIONE E LISTA PRODOTTI
// =======================================================

const INITIAL_WALLET = 10000; // Credito iniziale per la simulazione

// Mappa degli articoli in vendita
const SHOP_ITEMS = {
    MACCHINE: [
        { key: 'PANDA', name: 'Fiat Panda Usata', price: 500, emoji: '🚗' },
        { key: 'BMW', name: 'BMW Sportiva', price: 4500, emoji: '🏎️' },
        { key: 'FERRARI', name: 'Ferrari F40', price: 12000, emoji: '🔥' },
    ],
    CASE: [
        { key: 'MONOLOCALE', name: 'Monolocale in Periferia', price: 1500, emoji: '🏠' },
        { key: 'APPARTAMENTO', name: 'Appartamento in Centro', price: 8000, emoji: '🏢' },
        { key: 'VILLA', name: 'Villa con Piscina', price: 25000, emoji: '🏰' },
    ],
    SCARPE: [
        { key: 'SNEAKERS', name: 'Sneakers Comode', price: 50, emoji: '👟' },
        { key: 'STIVALI', name: 'Stivali di Pelle', price: 150, emoji: '👢' },
        { key: 'TACCHI', name: 'Tacchi a Spillo', price: 300, emoji: '👠' },
    ],
};

// Funzione per ottenere o inizializzare l'inventario di un utente
function getOrCreateUserInventory(conn, jid) {
    // Usa la variabile globale 'conn.shop' per la memorizzazione in RAM
    conn.shop = conn.shop ? conn.shop : {};
    if (!conn.shop[jid]) {
        conn.shop[jid] = {
            wallet: INITIAL_WALLET,
            inventory: { MACCHINE: [], CASE: [], SCARPE: [] }
        };
    }
    return conn.shop[jid];
}

// =======================================================
// FUNZIONI DI GENERAZIONE DEI MESSAGGI
// =======================================================

/**
 * Genera la visualizzazione dell'inventario e del portafoglio.
 * @param {object} userData - I dati dell'utente (wallet, inventory).
 * @returns {string} Il testo formattato.
 */
function createInventorySummary(userData) {
    let summary = `💳 *PORTAFOGLIO:* ${userData.wallet.toLocaleString('it-IT')} Crediti\n`;
    summary += `════════════════════════\n`;

    let inventoryList = '';
    let hasItems = false;

    for (const category in userData.inventory) {
        const items = userData.inventory[category];
        if (items.length > 0) {
            hasItems = true;
            inventoryList += `\n*${category}:*\n`;
            items.forEach(item => {
                inventoryList += `  - ${item.emoji} ${item.name} (${item.key})\n`;
            });
        }
    }

    if (!hasItems) {
        inventoryList = "\n_Non possiedi ancora alcun articolo. Inizia a comprare!_";
    }

    return summary + `📦 *IL TUO INVENTARIO:*${inventoryList}\n\n`;
}

/**
 * Genera il menu di acquisto per una categoria.
 * @param {string} categoryKey - Chiave della categoria (MACCHINE, CASE, SCARPE).
 * @param {string} usedPrefix - Prefisso del bot.
 * @param {string} command - Comando del bot.
 * @returns {object} Oggetto messaggio interattivo.
 */
function createCategoryMenu(categoryKey, usedPrefix, command) {
    const items = SHOP_ITEMS[categoryKey];
    if (!items) return null;

    const buttons = items.map(item => ({
        // Il pulsante invia il comando: .shop BUY_MACCHINE_PANDA
        buttonId: `${usedPrefix}${command} BUY_${categoryKey}_${item.key}`,
        buttonText: { displayText: `${item.emoji} ${item.name} | ${item.price.toLocaleString('it-IT')} C` },
        type: 1
    }));

    const text = `🛒 *ACQUISTA ${categoryKey}*\n\nSeleziona l'articolo che desideri acquistare. Assicurati di avere crediti sufficienti.`;

    // Aggiungi un pulsante per tornare al menu principale
    buttons.push({ buttonId: `${usedPrefix}${command} MAIN_MENU`, buttonText: { displayText: "↩️ Torna al Menu Principale" }, type: 1 });

    return {
        text: text,
        footer: 'Scegli saggiamente!',
        buttons: buttons,
    };
}


// =======================================================
// HANDLER PRINCIPALE
// =======================================================

let handler = async (m, { conn, usedPrefix, command, pushname }) => {
    
    const sender = m.sender;
    const senderName = pushname || 'Utente';
    
    // Inizializza o recupera i dati dell'utente dalla RAM
    let userData = getOrCreateUserInventory(conn, sender);

    // 1. Parsing dell'input (Cattura sia comando che click pulsante)
    const btnId = m?.message?.buttonsResponseMessage?.selectedButtonId || "";
    const text = m.text || btnId || "";
    
    // Argomento 1: Azione (es. CATEGORY, BUY, MAIN_MENU)
    const arg1 = text.replace(usedPrefix, "").trim().split(/\s+/)[1] || ""; 
    // Argomento 2: Categoria (es. MACCHINE, CASE)
    const arg2 = text.replace(usedPrefix, "").trim().split(/\s+/)[2] || ""; 
    // Argomento 3: Chiave Articolo (es. FERRARI)
    const arg3 = text.replace(usedPrefix, "").trim().split(/\s+/)[3] || ""; 

    try {
        // --- LOGICA DI ROUTING DELLE AZIONI ---

        if (arg1.startsWith('CATEGORY_')) {
            // Caso: L'utente ha selezionato una categoria dal menu principale
            const categoryKey = arg1.split('_')[1];
            if (SHOP_ITEMS[categoryKey]) {
                const categoryMenu = createCategoryMenu(categoryKey, usedPrefix, command);
                return await conn.sendMessage(m.chat, categoryMenu, { quoted: m });
            }
            return m.reply("❌ Categoria non valida.");

        } else if (arg1.startsWith('BUY_')) {
            // Caso: L'utente ha cliccato sul pulsante Acquista
            const categoryKey = arg2;
            const itemKey = arg3;

            if (!SHOP_ITEMS[categoryKey]) return m.reply("❌ Errore: Categoria non valida.");

            const itemToBuy = SHOP_ITEMS[categoryKey].find(item => item.key === itemKey);

            if (!itemToBuy) return m.reply("❌ Errore: Articolo non trovato.");
            
            // Verifica se l'utente possiede già l'articolo (opzionale, ma utile)
            const ownedItems = userData.inventory[categoryKey] || [];
            if (ownedItems.some(item => item.key === itemKey)) {
                return m.reply(`❌ Possiedi già l'articolo: ${itemToBuy.name}!`);
            }

            if (userData.wallet >= itemToBuy.price) {
                // Esecuzione dell'acquisto
                userData.wallet -= itemToBuy.price;
                userData.inventory[categoryKey] = [...ownedItems, itemToBuy];
                
                // Salva lo stato aggiornato (in memoria - NON persistente)
                conn.shop[sender] = userData;

                // Messaggio di successo e reindirizzamento al menu principale
                await conn.reply(m.chat, `🎉 *ACQUISTO RIUSCITO!* Hai comprato *${itemToBuy.name}* per ${itemToBuy.price.toLocaleString('it-IT')} Crediti.`, m);
                
                // Forza la visualizzazione del menu principale aggiornato (fallthrough)

            } else {
                return conn.reply(m.chat, `💸 *FONDI INSUFFICIENTI!* Hai ${userData.wallet.toLocaleString('it-IT')} Crediti, ma servono ${itemToBuy.price.toLocaleString('it-IT')} Crediti per ${itemToBuy.name}.`, m);
            }

        } else if (arg1 === 'MAIN_MENU') {
            // Caso: Torna al menu principale (Fallthrough)
            // L'esecuzione continua per mostrare il menu principale.
        }
        
        // --- 3. LOGICA COMANDO INIZIALE (.shop) ---
        // Viene eseguita per mostrare l'inventario e il menu di selezione.

        const inventorySummary = createInventorySummary(userData);

        const categoryButtons = [
            // I pulsanti del menu creano il comando completo: .shop CATEGORY_MACCHINE
            { buttonId: `${usedPrefix}${command} CATEGORY_MACCHINE`, buttonText: { displayText: "🏎️ MACCHINE" }, type: 1 },
            { buttonId: `${usedPrefix}${command} CATEGORY_CASE`, buttonText: { displayText: "🏠 CASE" }, type: 1 },
            { buttonId: `${usedPrefix}${command} CATEGORY_SCARPE`, buttonText: { displayText: "👟 SCARPE" }, type: 1 },
        ];

        const menuMessage = {
            text: inventorySummary + `\nSeleziona una categoria per vedere gli articoli in vendita:`,
            footer: `Bot Shop (Dati non persistenti) | Utente: ${senderName}`,
            buttons: categoryButtons,
        };

        return await conn.sendMessage(m.chat, menuMessage, { quoted: m });

    } catch (e) {
        console.error(`🔴 ERRORE FATALE nell'handler SHOP: ${e.message}`, e);
        return conn.reply(m.chat, `❌ Si è verificato un errore critico durante lo shopping: ${e.message}`, m);
    }
};

handler.help = ['shop', 'store'];
handler.tags = ['fun', 'utility'];
handler.command = ['shop', 'store'];
handler.group = true; 
handler.fail = null; 

export default handler;
