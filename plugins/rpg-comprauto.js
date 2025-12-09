/*
  =============================================================
  PLUGIN: fun-shop.js (Rinox Supermarket - Versione In-Memory con Immagini)
  
  ATTENZIONE: Questa versione NON usa Firestore. I dati (portafoglio e inventario)
  verranno persi ogni volta che il bot viene riavviato.
  
  FIX CRITICO: Sostituito il dominio per gli URL di placeholder per risolvere l'errore ENOTFOUND.
  =============================================================
*/

// =======================================================
// CONFIGURAZIONE E LISTA PRODOTTI
// =======================================================

const INITIAL_WALLET = 10000; // Credito iniziale per la simulazione

// Funzione helper per creare URL placeholder coerenti
// Utilizza dummyimage.com come alternativa robusta a placehold.co per evitare l'errore ENOTFOUND.
const createPlaceholderUrl = (text, color, width = 600, height = 300) => {
    // Pulisce il codice colore e imposta il testo bianco
    const bgColor = color.startsWith('#') ? color.substring(1) : color;
    const fgColor = 'FFFFFF'; 
    return `https://dummyimage.com/${width}x${height}/${bgColor}/${fgColor}&text=${encodeURIComponent(text)}`;
};


// Mappa degli articoli in vendita
const SHOP_ITEMS = {
    MACCHINE: {
        categoryUrl: createPlaceholderUrl("Rinox | Sezione MACCHINE", "4CAF50"), // Green
        items: [
            { key: 'PANDA', name: 'Fiat Panda Usata', price: 500, emoji: '🚗', imageUrl: createPlaceholderUrl("Fiat Panda - Affare!", "FF5722") }, // Deep Orange
            { key: 'BMW', name: 'BMW Sportiva', price: 4500, emoji: '🏎️', imageUrl: createPlaceholderUrl("BMW - Velocità", "03A9F4") }, // Light Blue
            { key: 'FERRARI', name: 'Ferrari F40', price: 12000, emoji: '🔥', imageUrl: createPlaceholderUrl("Ferrari - Lusso", "F44336") }, // Red
        ]
    },
    CASE: {
        categoryUrl: createPlaceholderUrl("Rinox | Sezione CASE", "2196F3"), // Blue
        items: [
            { key: 'MONOLOCALE', name: 'Monolocale in Periferia', price: 1500, emoji: '🏠', imageUrl: createPlaceholderUrl("Monolocale - Piccolo", "009688") }, // Teal
            { key: 'APPARTAMENTO', name: 'Appartamento in Centro', price: 8000, emoji: '🏢', imageUrl: createPlaceholderUrl("Appartamento - Comodo", "9C27B0") }, // Purple
            { key: 'VILLA', name: 'Villa con Piscina', price: 25000, emoji: '🏰', imageUrl: createPlaceholderUrl("Villa - Stupenda", "FFC107") }, // Amber
        ]
    },
    SCARPE: {
        categoryUrl: createPlaceholderUrl("Rinox | Sezione SCARPE", "FF9800"), // Orange
        items: [
            { key: 'SNEAKERS', name: 'Sneakers Comode', price: 50, emoji: '👟', imageUrl: createPlaceholderUrl("Sneakers - Relax", "607D8B") }, // Blue Grey
            { key: 'STIVALI', name: 'Stivali di Pelle', price: 150, emoji: '👢', imageUrl: createPlaceholderUrl("Stivali - Tendenza", "795548") }, // Brown
            { key: 'TACCHI', name: 'Tacchi a Spillo', price: 300, emoji: '👠', imageUrl: createPlaceholderUrl("Tacchi - Eleganza", "E91E63") }, // Pink
        ]
    },
};

// Funzione per ottenere o inizializzare l'inventario di un utente
function getOrCreateUserInventory(conn, jid) {
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
 */
function createCategoryMenu(categoryKey, usedPrefix, command) {
    const categoryData = SHOP_ITEMS[categoryKey];
    const items = categoryData.items;

    const buttons = items.map(item => ({
        // Il pulsante invia il comando: .shop BUY_MACCHINE_PANDA
        buttonId: `${usedPrefix}${command} BUY_${categoryKey}_${item.key}`,
        buttonText: { displayText: `${item.emoji} ${item.name} | ${item.price.toLocaleString('it-IT')} C` },
        type: 1
    }));

    const text = `🛒 *ACQUISTA ${categoryKey}*\n\nSeleziona l'articolo che desideri acquistare:`;

    // Aggiungi un pulsante per tornare al menu principale
    buttons.push({ buttonId: `${usedPrefix}${command} MAIN_MENU`, buttonText: { displayText: "↩️ Torna al Menu Principale" }, type: 1 });

    // MESSAGGIO CON IMMAGINE E BOTTONI
    return {
        image: { url: categoryData.categoryUrl }, // Immagine principale
        caption: text, // Il testo diventa la didascalia dell'immagine
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
    
    // L'azione completa è al secondo elemento dell'array
    const fullAction = text.replace(usedPrefix, "").trim().split(/\s+/)[1] || ""; 
    let categoryKey = '';
    let itemKey = '';

    if (fullAction.startsWith('CATEGORY_')) {
        categoryKey = fullAction.split('_')[1];

    } else if (fullAction.startsWith('BUY_')) {
        const parts = fullAction.split('_');
        categoryKey = parts[1];
        itemKey = parts[2];
    }
    
    try {
        // --- LOGICA DI ROUTING DELLE AZIONI ---

        if (fullAction.startsWith('CATEGORY_')) {
            // Caso: L'utente ha selezionato una categoria
            if (SHOP_ITEMS[categoryKey]) {
                const categoryMenu = createCategoryMenu(categoryKey, usedPrefix, command);
                return await conn.sendMessage(m.chat, categoryMenu, { quoted: m });
            }
            return m.reply("❌ Categoria non valida.");

        } else if (fullAction.startsWith('BUY_')) {
            // Caso: L'utente ha cliccato sul pulsante Acquista
            if (!SHOP_ITEMS[categoryKey]) return m.reply("❌ Errore: Categoria di acquisto non valida.");

            const itemToBuy = SHOP_ITEMS[categoryKey].items.find(item => item.key === itemKey);

            if (!itemToBuy) return m.reply("❌ Errore: Articolo non trovato.");
            
            // Verifica se l'utente possiede già l'articolo
            const ownedItems = userData.inventory[categoryKey] || [];
            if (ownedItems.some(item => item.key === itemKey)) {
                return conn.reply(m.chat, `❌ Possiedi già l'articolo: ${itemToBuy.name}!`, m);
            }

            if (userData.wallet >= itemToBuy.price) {
                // Esecuzione dell'acquisto
                userData.wallet -= itemToBuy.price;
                userData.inventory[categoryKey] = [...ownedItems, itemToBuy];
                
                // Salva lo stato aggiornato (in memoria)
                conn.shop[sender] = userData;

                // Messaggio di successo con l'immagine dell'articolo
                const successMessage = `🎉 *ACQUISTO RIUSCITO!* Hai comprato *${itemToBuy.name}* per ${itemToBuy.price.toLocaleString('it-IT')} Crediti.\n\nControlla il tuo inventario con il comando .shop!`;
                
                // MESSAGGIO CON IMMAGINE E TESTO PER LA CONFERMA DI ACQUISTO
                await conn.sendMessage(m.chat, {
                    image: { url: itemToBuy.imageUrl }, // IMPOSTA L'IMMAGINE DELL'ARTICOLO
                    caption: successMessage, // Il testo diventa la didascalia
                    footer: `Il tuo nuovo acquisto!`,
                }, { quoted: m });
                
                return; 

            } else {
                return conn.reply(m.chat, `💸 *FONDI INSUFFICIENTI!* Hai ${userData.wallet.toLocaleString('it-IT')} Crediti, ma servono ${itemToBuy.price.toLocaleString('it-IT')} Crediti per ${itemToBuy.name}.`, m);
            }

        } else if (fullAction === 'MAIN_MENU' || fullAction === '') {
            // Caso: Torna al menu principale o primo accesso (.shop)
            
            const inventorySummary = createInventorySummary(userData);

            const categoryButtons = [
                { buttonId: `${usedPrefix}${command} CATEGORY_MACCHINE`, buttonText: { displayText: "🏎️ MACCHINE" }, type: 1 },
                { buttonId: `${usedPrefix}${command} CATEGORY_CASE`, buttonText: { displayText: "🏠 CASE" }, type: 1 },
                { buttonId: `${usedPrefix}${command} CATEGORY_SCARPE`, buttonText: { displayText: "👟 SCARPE" }, type: 1 },
            ];

            const menuText = `🛒 *BENVENUTO AL RINOX SUPERMARKET!* 🛒\n\n` + inventorySummary + 
                            `\nSeleziona una categoria per esplorare gli scaffali:`;

            const mainImage = createPlaceholderUrl("Rinox Supermarket", "795548", 600, 300); 
            
            // MESSAGGIO CON IMMAGINE E BOTTONI PER IL MENU PRINCIPALE
            const menuMessage = {
                image: { url: mainImage },
                caption: menuText, // Il testo diventa la didascalia
                footer: `Bot Shop (Dati non persistenti) | Utente: ${senderName}`,
                buttons: categoryButtons,
            };

            return await conn.sendMessage(m.chat, menuMessage, { quoted: m });
        }

    } catch (e) {
        console.error(`🔴 ERRORE FATALE nell'handler SHOP: ${e.message}`, e);
        return conn.reply(m.chat, `❌ Si è verificato un errore critico: ${e.message}`, m);
    }
};

handler.help = ['shop', 'store'];
handler.tags = ['fun', 'utility'];
handler.command = ['shop', 'store'];
handler.group = true; 
handler.fail = null; 

export default handler;
