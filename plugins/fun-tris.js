let games = {}; // partite in corso

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const chatId = m.chat;
    const sender = m.sender;

    // ===== AVVIO PARTITA (.tris) =====
    if (command === 'tris') {
        if (!m.mentionedJid || m.mentionedJid.length === 0)
            return conn.sendMessage(chatId, { text: `⚠️ Devi menzionare un avversario!\nEsempio: ${usedPrefix}tris @utente` }, { quoted: m });

        const player1 = sender;
        const player2 = m.mentionedJid[0];

        if (player1 === player2)
            return conn.sendMessage(chatId, { text: '❌ Non puoi giocare contro te stesso!' }, { quoted: m });

        if (games[chatId])
            return conn.sendMessage(chatId, { text: '❌ Una partita è già in corso in questo gruppo!' }, { quoted: m });

        games[chatId] = {
            board: [
                ['A1','A2','A3'],
                ['B1','B2','B3'],
                ['C1','C2','C3']
            ],
            players: [player1, player2],
            turn: 0,
            timer: null
        };

        await sendBoard(chatId, conn, games[chatId], 
            `🎮 Partita iniziata!\n❌ @${player1.split('@')[0]} VS ⭕ @${player2.split('@')[0]}\nTocca a @${player1.split('@')[0]}`
        );

        startTurnTimer(chatId, conn);
    }

    // ===== MOSSA (.putris) =====
    else if (command === 'putris') {
        const game = games[chatId];
        if (!game)
            return conn.sendMessage(chatId, { text: '❌ Nessuna partita in corso!' }, { quoted: m });

        const currentPlayer = game.players[game.turn];

        // Controllo se il mittente è il giocatore di turno
        if (sender !== currentPlayer) {
            return conn.sendMessage(chatId, {
                text: `❌ Non è il tuo turno!\nAttualmente tocca a @${currentPlayer.split('@')[0]}`,
                mentions: [currentPlayer]
            }, { quoted: m });
        }

        const args = text.trim().split(' ');
        if (!args[0])
            return conn.sendMessage(chatId, { text: `⚠️ Specifica una posizione! Esempio: ${usedPrefix}putris A1` }, { quoted: m });

        const pos = args[0].toUpperCase();
        const map = { A: 0, B: 1, C: 2 };
        const row = map[pos[0]];
        const col = parseInt(pos[1]) - 1;

        if (row === undefined || isNaN(col) || col < 0 || col > 2)
            return conn.sendMessage(chatId, { text: '⚠️ Posizione non valida! Usa A1, A2, A3, B1, ecc.' }, { quoted: m });

        if (['❌','⭕'].includes(game.board[row][col]))
            return conn.sendMessage(chatId, { text: '❌ Casella già occupata!' }, { quoted: m });

        const symbol = game.turn === 0 ? '❌' : '⭕';
        game.board[row][col] = symbol;

        // Controllo vittoria
        if (checkWinner(game.board)) {
            clearTimeout(game.timer);
            await sendBoard(chatId, conn, game, `🎉 Complimenti @${sender.split('@')[0]}, hai vinto!`);
            delete games[chatId];
            return;
        }

        // Controllo pareggio
        if (game.board.flat().every(c => ['❌','⭕'].includes(c))) {
            clearTimeout(game.timer);
            await sendBoard(chatId, conn, game, '🤝 Pareggio! La scacchiera è piena.');
            delete games[chatId];
            return;
        }

        // Cambio turno
        game.turn = 1 - game.turn;
        const nextPlayer = game.players[game.turn];
        
        await sendBoard(chatId, conn, game, `Mossa registrata! Ora tocca a @${nextPlayer.split('@')[0]}`);
        startTurnTimer(chatId, conn);
    }

    // ===== FINE FORZATA (.endtris) =====
    else if (command === 'endtris') {
        if (games[chatId]) {
            clearTimeout(games[chatId].timer);
            delete games[chatId];
            await conn.sendMessage(chatId, { text: '🛑 Partita terminata forzatamente.' }, { quoted: m });
        } else {
            await conn.sendMessage(chatId, { text: '❌ Nessuna partita attiva da terminare.' }, { quoted: m });
        }
    }
};

// ===== FUNZIONI DI SUPPORTO =====

async function sendBoard(chatId, conn, game, msg) {
    const s = c => (c === '❌' || c === '⭕') ? c : '⬜';
    const boardStr = 
`      1   2   3
   ┌───┬───┬───┐
 A │ ${s(game.board[0][0])} │ ${s(game.board[0][1])} │ ${s(game.board[0][2])} │
   ├───┼───┼───┤
 B │ ${s(game.board[1][0])} │ ${s(game.board[1][1])} │ ${s(game.board[1][2])} │
   ├───┼───┼───┤
 C │ ${s(game.board[2][0])} │ ${s(game.board[2][1])} │ ${s(game.board[2][2])} │
   └───┴───┴───┘`;

    await conn.sendMessage(chatId, {
        text: `${boardStr}\n\n${msg}`,
        mentions: game.players
    });
}

function startTurnTimer(chatId, conn) {
    const game = games[chatId];
    if (!game) return;
    if (game.timer) clearTimeout(game.timer);

    game.timer = setTimeout(async () => {
        if (games[chatId]) {
            const loser = game.players[game.turn];
            await conn.sendMessage(chatId, {
                text: `⏱️ Tempo scaduto! @${loser.split('@')[0]} ha impiegato troppo tempo e ha perso la partita.`,
                mentions: [loser]
            });
            delete games[chatId];
        }
    }, 45000); // 45 secondi per pensare
}

function checkWinner(b) {
    // Righe e Colonne
    for (let i = 0; i < 3; i++) {
        if (b[i][0] === b[i][1] && b[i][1] === b[i][2] && ['❌','⭕'].includes(b[i][0])) return true;
        if (b[0][i] === b[1][i] && b[1][i] === b[2][i] && ['❌','⭕'].includes(b[0][i])) return true;
    }
    // Diagonali
    if (b[0][0] === b[1][1] && b[1][1] === b[2][2] && ['❌','⭕'].includes(b[0][0])) return true;
    if (b[0][2] === b[1][1] && b[1][1] === b[2][0] && ['❌','⭕'].includes(b[0][2])) return true;
    return false;
}

handler.command = /^(tris|putris|endtris)$/i;
export default handler;
