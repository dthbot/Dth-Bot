let games = {}; 

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const chatId = m.chat;

    // Estrae solo i numeri dall'ID (es. 393451234567)
    const parseId = (jid) => jid ? jid.split('@')[0].replace(/[^0-9]/g, '') : '';
    const senderId = parseId(m.sender);

    // ===== START (.tris) =====
    if (command === 'tris') {
        let mention = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
        
        if (!mention) 
            return conn.sendMessage(chatId, { text: `⚠️ Devi menzionare qualcuno o rispondere a un suo messaggio!\nEsempio: ${usedPrefix}tris @utente` }, { quoted: m });

        if (parseId(m.sender) === parseId(mention))
            return conn.sendMessage(chatId, { text: '❌ Non puoi giocare contro te stesso!' }, { quoted: m });

        if (games[chatId])
            return conn.sendMessage(chatId, { text: '❌ C\'è già una partita in corso in questa chat!' }, { quoted: m });

        games[chatId] = {
            board: [['A1','A2','A3'],['B1','B2','B3'],['C1','C2','C3']],
            players: [m.sender, mention], 
            turn: 0,
            timer: null
        };

        await sendBoard(chatId, conn, games[chatId], `🎮 Partita iniziata!\n❌ @${m.sender.split('@')[0]}\n⭕ @${mention.split('@')[0]}\n\nTocca a @${m.sender.split('@')[0]}`);
        startTurnTimer(chatId, conn);
    }

    // ===== MOVE (.putris) =====
    else if (command === 'putris') {
        const game = games[chatId];
        if (!game) return conn.sendMessage(chatId, { text: '❌ Nessuna partita attiva. Iniziane una con .tris' }, { quoted: m });

        const currentPlayerJid = game.players[game.turn];
        
        // CONFRONTO NUMERICO PURO
        if (senderId !== parseId(currentPlayerJid)) {
            return conn.sendMessage(chatId, {
                text: `❌ Non è il tuo turno!\nDeve muovere @${currentPlayerJid.split('@')[0]}`,
                mentions: [currentPlayerJid]
            }, { quoted: m });
        }

        const move = text.trim().toUpperCase();
        const map = { A: 0, B: 1, C: 2 };
        const row = map[move[0]];
        const col = parseInt(move[1]) - 1;

        if (row === undefined || isNaN(col) || col < 0 || col > 2)
            return conn.sendMessage(chatId, { text: '⚠️ Posizione non valida! Usa ad esempio: .putris B2' }, { quoted: m });

        if (['❌','⭕'].includes(game.board[row][col]))
            return conn.sendMessage(chatId, { text: '❌ Casella già occupata!' }, { quoted: m });

        game.board[row][col] = game.turn === 0 ? '❌' : '⭕';

        if (checkWinner(game.board)) {
            clearTimeout(game.timer);
            await sendBoard(chatId, conn, game, `🎉 VITTORIA! @${m.sender.split('@')[0]} ha vinto la partita!`);
            delete games[chatId];
        } else if (game.board.flat().every(c => ['❌','⭕'].includes(c))) {
            clearTimeout(game.timer);
            await sendBoard(chatId, conn, game, '🤝 Pareggio! Non ci sono più mosse disponibili.');
            delete games[chatId];
        } else {
            game.turn = 1 - game.turn;
            const nextPlayer = game.players[game.turn];
            await sendBoard(chatId, conn, game, `Mossa fatta! Tocca a @${nextPlayer.split('@')[0]}`);
            startTurnTimer(chatId, conn);
        }
    }

    // ===== END (.endtris) =====
    else if (command === 'endtris') {
        if (games[chatId]) {
            clearTimeout(games[chatId].timer);
            delete games[chatId];
            await conn.sendMessage(chatId, { text: '🛑 La partita è stata annullata.' });
        }
    }
};

// --- UTILS ---

async function sendBoard(chatId, conn, game, msg) {
    const s = c => (c === '❌' || c === '⭕') ? c : '⬜';
    const boardStr = `      1   2   3\n   ┌───┬───┬───┐\n A │ ${s(game.board[0][0])} │ ${s(game.board[0][1])} │ ${s(game.board[0][2])} │\n   ├───┼───┼───┤\n B │ ${s(game.board[1][0])} │ ${s(game.board[1][1])} │ ${s(game.board[1][2])} │\n   ├───┼───┼───┤\n C │ ${s(game.board[2][0])} │ ${s(game.board[2][1])} │ ${s(game.board[2][2])} │\n   └───┴───┴───┘`;
    await conn.sendMessage(chatId, { text: `${boardStr}\n\n${msg}`, mentions: game.players });
}

function startTurnTimer(chatId, conn) {
    const game = games[chatId];
    if (game?.timer) clearTimeout(game.timer);
    game.timer = setTimeout(async () => {
        if (games[chatId]) {
            await conn.sendMessage(chatId, { text: `⏱️ Tempo scaduto! La partita è stata chiusa per inattività.` });
            delete games[chatId];
        }
    }, 60000);
}

function checkWinner(b) {
    for (let i = 0; i < 3; i++) {
        if (b[i][0] === b[i][1] && b[i][1] === b[i][2] && ['❌','⭕'].includes(b[i][0])) return true;
        if (b[0][i] === b[1][i] && b[1][i] === b[2][i] && ['❌','⭕'].includes(b[0][i])) return true;
    }
    if (b[0][0] === b[1][1] && b[1][1] === b[2][2] && ['❌','⭕'].includes(b[0][0])) return true;
    if (b[0][2] === b[1][1] && b[1][1] === b[2][0] && ['❌','⭕'].includes(b[0][2])) return true;
    return false;
}

handler.command = /^(tris|putris|endtris)$/i;
export default handler;
