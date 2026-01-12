let games = {}; 

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const chatId = m.chat;
    // Funzione interna per pulire i JID e confrontarli correttamente
    const getId = (jid) => jid.split('@')[0].split(':')[0]; 
    const senderId = getId(m.sender);

    if (command === 'tris') {
        if (!m.mentionedJid || m.mentionedJid.length === 0)
            return conn.sendMessage(chatId, { text: `⚠️ Menziona un avversario!\nEsempio: ${usedPrefix}tris @utente` }, { quoted: m });

        const player1 = m.sender;
        const player2 = m.mentionedJid[0];

        if (getId(player1) === getId(player2))
            return conn.sendMessage(chatId, { text: '❌ Non puoi giocare contro te stesso!' }, { quoted: m });

        if (games[chatId])
            return conn.sendMessage(chatId, { text: '❌ Una partita è già in corso!' }, { quoted: m });

        games[chatId] = {
            board: [['A1','A2','A3'],['B1','B2','B3'],['C1','C2','C3']],
            players: [player1, player2], // Salviamo i JID completi per le menzioni
            turn: 0,
            timer: null
        };

        await sendBoard(chatId, conn, games[chatId], `🎮 Turno di: @${player1.split('@')[0]}`);
        startTurnTimer(chatId, conn);
    }

    else if (command === 'putris') {
        const game = games[chatId];
        if (!game) return;

        const currentPlayerJid = game.players[game.turn];
        const currentPlayerId = getId(currentPlayerJid);

        // CONFRONTO PULITO
        if (senderId !== currentPlayerId) {
            return conn.sendMessage(chatId, {
                text: `❌ Non è il tuo turno!\nAspetta @${currentPlayerJid.split('@')[0]}`,
                mentions: [currentPlayerJid]
            }, { quoted: m });
        }

        const move = text.trim().toUpperCase();
        const map = { A: 0, B: 1, C: 2 };
        const row = map[move[0]];
        const col = parseInt(move[1]) - 1;

        if (row === undefined || isNaN(col) || col < 0 || col > 2)
            return conn.sendMessage(chatId, { text: '⚠️ Usa A1, B2, ecc.' }, { quoted: m });

        if (['❌','⭕'].includes(game.board[row][col]))
            return conn.sendMessage(chatId, { text: '❌ Casella occupata!' }, { quoted: m });

        game.board[row][col] = game.turn === 0 ? '❌' : '⭕';

        if (checkWinner(game.board)) {
            clearTimeout(game.timer);
            await sendBoard(chatId, conn, game, `🎉 Vittoria per @${m.sender.split('@')[0]}!`);
            delete games[chatId];
        } else if (game.board.flat().every(c => ['❌','⭕'].includes(c))) {
            clearTimeout(game.timer);
            await sendBoard(chatId, conn, game, '🤝 Pareggio!');
            delete games[chatId];
        } else {
            game.turn = 1 - game.turn;
            const nextPlayer = game.players[game.turn];
            await sendBoard(chatId, conn, game, `Tocca a @${nextPlayer.split('@')[0]}`);
            startTurnTimer(chatId, conn);
        }
    }

    else if (command === 'endtris') {
        if (games[chatId]) {
            clearTimeout(games[chatId].timer);
            delete games[chatId];
            await conn.sendMessage(chatId, { text: '🛑 Partita chiusa.' });
        }
    }
};

// --- FUNZIONI DI SUPPORTO (Non modificate, ma incluse per completezza) ---

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
            await conn.sendMessage(chatId, { text: `⏱️ Tempo scaduto! Partita terminata.` });
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
