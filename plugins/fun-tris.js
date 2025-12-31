let games = {}; // partite in corso

let handler = async (m, { conn, usedPrefix }) => {
    const text = m.text.trim();
    const chatId = m.chat;

    // ===== AVVIO PARTITA =====
    if (text.startsWith(usedPrefix + 'tris')) {
        if (!m.mentionedJid || m.mentionedJid.length === 0)
            return conn.sendMessage(chatId, { text: '⚠️ Devi menzionare un avversario!\nEsempio: .tris @utente' }, { quoted: m });

        const player1 = m.sender;
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

        await sendBoard(chatId, m, games[chatId],
            `🎮 Partita iniziata!
@${player1.split('@')[0]} (❌) VS @${player2.split('@')[0]} (⭕)
Tocca a @${player1.split('@')[0]}`
        );

        startTurnTimer(chatId, conn);
    }

    // ===== MOSSA =====
    else if (text.startsWith(usedPrefix + 'putris')) {
        const game = games[chatId];
        if (!game)
            return conn.sendMessage(chatId, { text: '❌ Nessuna partita in corso!' }, { quoted: m });

        const player = m.sender;
        const currentPlayer = game.players[game.turn];

        // controllo turno FIXATO
        if (player !== currentPlayer) {
            return conn.sendMessage(chatId, {
                text: `❌ Non è il tuo turno!\nTocca a @${currentPlayer.split('@')[0]}`,
                mentions: [currentPlayer]
            }, { quoted: m });
        }

        const args = text.split(' ').slice(1);
        if (!args[0])
            return conn.sendMessage(chatId, { text: '⚠️ Usa una posizione (A1 - C3)' }, { quoted: m });

        const pos = args[0].toUpperCase();
        const map = { A:0, B:1, C:2 };
        const row = map[pos[0]];
        const col = parseInt(pos[1]) - 1;

        if (row === undefined || col < 0 || col > 2)
            return conn.sendMessage(chatId, { text: '⚠️ Posizione non valida! (A1-C3)' }, { quoted: m });

        if (['❌','⭕'].includes(game.board[row][col]))
            return conn.sendMessage(chatId, { text: '❌ Casella già occupata!' }, { quoted: m });

        const symbol = game.turn === 0 ? '❌' : '⭕';
        game.board[row][col] = symbol;

        // vittoria
        if (checkWinner(game.board)) {
            clearTimeout(game.timer);
            await sendBoard(chatId, m, game, `🎉 @${player.split('@')[0]} ha vinto!`);
            delete games[chatId];
            return;
        }

        // pareggio
        if (game.board.flat().every(c => ['❌','⭕'].includes(c))) {
            clearTimeout(game.timer);
            await sendBoard(chatId, m, game, '🤝 Pareggio!');
            delete games[chatId];
            return;
        }

        // cambio turno
        game.turn = 1 - game.turn;
        const nextPlayer = game.players[game.turn];

        await sendBoard(chatId, m, game, `Tocca a @${nextPlayer.split('@')[0]}`);
        startTurnTimer(chatId, conn);
    }

    // ===== FINE FORZATA =====
    else if (text.startsWith(usedPrefix + 'endtris')) {
        if (games[chatId]) {
            clearTimeout(games[chatId].timer);
            delete games[chatId];
            await conn.sendMessage(chatId, { text: '🛑 Partita terminata.' }, { quoted: m });
        } else {
            await conn.sendMessage(chatId, { text: '❌ Nessuna partita in corso.' }, { quoted: m });
        }
    }
};

// ===== GRAFICA TABELLONE =====
async function sendBoard(chatId, m, game, msg) {
    const s = c => ['❌','⭕'].includes(c) ? c : '⬜';

    let board =
`      1   2   3
   ┌───┬───┬───┐
 A │ ${s(game.board[0][0])} │ ${s(game.board[0][1])} │ ${s(game.board[0][2])} │
   ├───┼───┼───┤
 B │ ${s(game.board[1][0])} │ ${s(game.board[1][1])} │ ${s(game.board[1][2])} │
   ├───┼───┼───┤
 C │ ${s(game.board[2][0])} │ ${s(game.board[2][1])} │ ${s(game.board[2][2])} │
   └───┴───┴───┘`;

    await m.conn.sendMessage(chatId, {
        text: `${board}\n\n${msg}`,
        mentions: game.players
    }, { quoted: m });
}

// ===== TIMER =====
function startTurnTimer(chatId, conn) {
    const game = games[chatId];
    if (!game) return;

    if (game.timer) clearTimeout(game.timer);

    const currentPlayer = game.players[game.turn];

    game.timer = setTimeout(async () => {
        await conn.sendMessage(chatId, {
            text: `⏱️ Tempo scaduto!\n@${currentPlayer.split('@')[0]} ha perso.\nPartita terminata.`,
            mentions: [currentPlayer]
        });
        delete games[chatId];
    }, 30000);
}

// ===== CONTROLLO VITTORIA =====
function checkWinner(b) {
    for (let i = 0; i < 3; i++) {
        if (b[i][0] === b[i][1] && b[i][1] === b[i][2] && ['❌','⭕'].includes(b[i][0])) return true;
        if (b[0][i] === b[1][i] && b[1][i] === b[2][i] && ['❌','⭕'].includes(b[0][i])) return true;
    }
    if (b[0][0] === b[1][1] && b[1][1] === b[2][2] && ['❌','⭕'].includes(b[0][0])) return true;
    if (b[0][2] === b[1][1] && b[1][1] === b[2][0] && ['❌','⭕'].includes(b[0][2])) return true;
    return false;
}

handler.command = ['tris','putris','endtris'];
export default handler;