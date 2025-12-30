/*
 * Plugin: arcade.js
 * Comando: .arcade
 * Giochi inclusi: Labirinto (Maze) e Indovina il Tesoro (Cups/Shell Game).
 * FIX: Immagine rimossa per prevenire il ricorrente AxiosError: 404.
 */

// Stato del gioco attivo (User ID -> Stato del Gioco)
let gameStates = {};

// IMMAGINE RIMOSSA PER STABILITÀ. Usiamo solo testo e bottoni.
// const ARCADE_IMAGE = "..."; 

// --- Definizione del Labirinto Semplificato ---
const mazeMap = {
    'Start': { text: "Sei all'ingresso. Vai avanti o a sinistra?", options: { 'Avanti': 'C1', 'Sinistra': 'A1' } },
    'A1': { text: "Vicolo cieco. Hai solo un'opzione.", options: { 'Torna al Centro': 'C1' } },
    'C1': { text: "Sei in un incrocio. Vai a destra o dritto?", options: { 'Destra': 'D1', 'Dritto': 'C2' } },
    'D1': { text: "Un ponte di corda. Lo attraversi?", options: { 'Attraversa il Ponte': 'E1' } },
    'E1': { text: "Hai trovato il TESORO! Complimenti.", options: { 'Fine': 'End' } },
    'C2': { text: "Una trappola a pavimento! Devi tornare indietro.", options: { 'Indietro': 'C1' } },
};

// --- Definizione Indovina il Tesoro ---
const CUPS = {
    CUP_ICON: '☕',
    TREASURE_ICON: '💎',
    EMPTY_ICON: '✖️'
};

// Funzione per inizializzare una nuova partita a Bicchiere
function initializeCups() {
    const treasureLocation = Math.floor(Math.random() * 3) + 1; 
    return {
        board: [CUPS.CUP_ICON, CUPS.CUP_ICON, CUPS.CUP_ICON],
        treasure: treasureLocation,
        message: "Il tesoro è sotto uno dei tre bicchieri. Fai la tua scelta!"
    };
}


// --- HANDLER PRINCIPALE ---
let handler = async (m, { conn, usedPrefix }) => {
    
    const userId = m.sender;
    const currentGameState = gameStates[userId];

    let [cmd, ...args] = m.text.trim().split(/\s+/);
    cmd = cmd.replace(usedPrefix, '').toLowerCase(); 

    // --- LOGICA GIOCHI ATTIVI ---
    if (currentGameState) {
        
        // --- GIOCO INDOVINA IL TESORO (Cups/Shell Game) ---
        if (currentGameState.game === 'cups') {
            const guess = parseInt(args[0]);
            const treasure = currentGameState.treasure;

            if (cmd === 'cups-guess') {
                if (![1, 2, 3].includes(guess)) {
                    return m.reply("❌ Scelta non valida. Riprova con i bottoni.");
                }
                
                delete gameStates[userId];
                
                const finalBoard = currentGameState.board.map((icon, index) => {
                    const cupNumber = index + 1;
                    if (cupNumber === treasure) return CUPS.TREASURE_ICON;
                    if (cupNumber === guess) return CUPS.EMPTY_ICON;
                    return icon; 
                });

                const revealBoardStr = `[1] ${finalBoard[0]}  [2] ${finalBoard[1]}  [3] ${finalBoard[2]}`;

                let resultMsg;
                if (guess === treasure) {
                    resultMsg = `🏆 *HAI VINTO!* 🏆\nHai indovinato! Il tesoro era sotto il bicchiere ${guess}.\n\n${revealBoardStr}`;
                } else {
                    resultMsg = `😭 *HAI PERSO...* 😭\nIl tesoro era sotto il bicchiere ${treasure}. La tua scelta (${guess}) era vuota.\n\n${revealBoardStr}`;
                }

                return m.reply(resultMsg);
            }
            
            if (cmd === 'arcade') {
                delete gameStates[userId];
                return m.reply("Hai abbandonato la partita Indovina il Tesoro.");
            }
        }
        
        // --- GIOCO LABIRINTO (Maze) ---
        if (currentGameState.game === 'maze') {
            const move = args[0];
            const currentPos = currentGameState.position;

            if (cmd === 'maze-move') {
                const currentRoom = mazeMap[currentPos];
                const nextPosKey = currentRoom.options[move];
                
                if (!nextPosKey || (!mazeMap[nextPosKey] && nextPosKey !== 'End')) {
                    return m.reply("❌ Mossa non valida. Riprova con un bottone.");
                }

                gameStates[userId].position = nextPosKey;

                if (nextPosKey === 'End') {
                    const finalMessage = "🎉 *COMPLETATO!* 🎉\nHai trovato l'uscita/il tesoro del labirinto!";
                    delete gameStates[userId];
                    return m.reply(finalMessage);
                }

                const nextRoom = mazeMap[nextPosKey];
                const buttons = Object.keys(nextRoom.options).map(key => ({
                    buttonId: `${usedPrefix}maze-move ${key}`, 
                    buttonText: { displayText: key }, 
                    type: 1
                }));
                
                buttons.push({ buttonId: `${usedPrefix}arcade`, buttonText: { displayText: '❌ Abbandona Labirinto' }, type: 1 });

                await conn.sendMessage(m.chat, {
                    text: `*LABIRINTO - Stanza ${nextPosKey}*\n\n${nextRoom.text}`,
                    footer: "Scegli la tua prossima mossa.",
                    buttons: buttons,
                    headerType: 1
                }, { quoted: m });
                return;
            }
            
            if (cmd === 'arcade') {
                delete gameStates[userId];
                return m.reply("Hai abbandonato il labirinto.");
            }
        }
    }


    // --- LOGICA MENU PRINCIPALE (Inizializzazione) ---
    if (cmd === 'arcade') {
        const buttons = [
            { buttonId: `${usedPrefix}arcade-start maze`, buttonText: { displayText: '🗺️ Labirinto Facile' }, type: 1 },
            { buttonId: `${usedPrefix}arcade-start cups`, buttonText: { displayText: '💎 Indovina il Tesoro' }, type: 1 },
            { buttonId: `${usedPrefix}arcade-info`, buttonText: { displayText: 'ℹ️ Regole' }, type: 1 },
        ];

        const menuText = `
╔══════════════════╗
║ 🕹️ *ARCADE ZONE* 🕹️
╠══════════════════╝
║
║ Seleziona un gioco per iniziare!
║
╚══════════════════`.trim();

        // **MODIFICA APPLICATA QUI: Nessuna immagine e headerType: 1**
        await conn.sendMessage(m.chat, {
            text: menuText, // Usiamo text invece di caption
            footer: "Scegli il tuo divertimento!",
            buttons: buttons,
            headerType: 1 // Header di tipo testo per evitare il 404
        }, { quoted: m });
        return;
    }
    
    // --- LOGICA DI AVVIO DEL GIOCO ---
    if (cmd === 'arcade-start') {
        const gameName = args[0];
        
        // Avvio Labirinto (headerType: 1, nessun cambiamento)
        if (gameName === 'maze') {
            gameStates[userId] = { game: 'maze', position: 'Start' };
            const startRoom = mazeMap['Start'];
            
            const buttons = Object.keys(startRoom.options).map(key => ({
                buttonId: `${usedPrefix}maze-move ${key}`, 
                buttonText: { displayText: key }, 
                type: 1
            }));
            
            buttons.push({ buttonId: `${usedPrefix}arcade`, buttonText: { displayText: '❌ Abbandona Labirinto' }, type: 1 });

            await conn.sendMessage(m.chat, {
                text: `*LABIRINTO - Stanza Start*\n\n${startRoom.text}`,
                footer: "Scegli la tua prossima mossa.",
                buttons: buttons,
                headerType: 1
            }, { quoted: m });
            return;
        }
        
        // Avvio Indovina il Tesoro (headerType: 1, nessun cambiamento)
        if (gameName === 'cups') {
            gameStates[userId] = { game: 'cups', ...initializeCups() };
            const initialState = gameStates[userId];

            const buttonsCups = [
                { buttonId: `${usedPrefix}cups-guess 1`, buttonText: { displayText: `${CUPS.CUP_ICON} Bicchiere 1` }, type: 1 },
                { buttonId: `${usedPrefix}cups-guess 2`, buttonText: { displayText: `${CUPS.CUP_ICON} Bicchiere 2` }, type: 1 },
                { buttonId: `${usedPrefix}cups-guess 3`, buttonText: { displayText: `${CUPS.CUP_ICON} Bicchiere 3` }, type: 1 }
            ];
            buttonsCups.push({ buttonId: `${usedPrefix}arcade`, buttonText: { displayText: '❌ Abbandona Gioco' }, type: 1 });

            await conn.sendMessage(m.chat, {
                text: `*INDOVINA IL TESORO*\n${initialState.message}\n\n[1] ${CUPS.CUP_ICON}  [2] ${CUPS.CUP_ICON}  [3] ${CUPS.CUP_ICON}`,
                footer: "Quale bicchiere nasconde il 💎?",
                buttons: buttonsCups,
                headerType: 1
            }, { quoted: m });
            return;
        }

        return m.reply("❌ Gioco non trovato.");
    }
    
    // --- LOGICA INFO/REGOLE --- (headerType: 1, nessun cambiamento)
    if (cmd === 'arcade-info') {
        const rulesText = `
📜 *REGOLE ARCADE* 📜

*1. Labirinto:*
- Si basa su mosse predefinite. Naviga con i bottoni fino a trovare il tesoro.

*2. Indovina il Tesoro:*
- Tre bicchieri (${CUPS.CUP_ICON}). Sotto uno c'è un diamante (${CUPS.TREASURE_ICON}).
- Scegli il bicchiere corretto al primo tentativo per vincere!

Torna al menu per giocare!
        `.trim();
        
        const backButton = [{ buttonId: `${usedPrefix}arcade`, buttonText: { displayText: '🏠 Menu Arcade' }, type: 1 }];

        await conn.sendMessage(m.chat, { text: rulesText, buttons: backButton, headerType: 1 }, { quoted: m });
        return;
    }
};

handler.help = ["arcade"];
handler.tags = ["gioco"];
handler.command = ["arcade", "arcade-start", "arcade-info", "maze-move", "cups-guess"];

export default handler;
