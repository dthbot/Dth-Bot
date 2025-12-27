let games = {}; // memorizza le partite in corso

let handler = async (m, { conn, usedPrefix }) => {
    const text = m.text.trim();
    const chatId = m.chat;

    if (text.startsWith(usedPrefix + 'tris')) {
        if (!m.mentionedJid || m.mentionedJid.length === 0)
            return conn.sendMessage(chatId, { text: '⚠️ Devi menzionare un avversario!\nEsempio: .tris @utente' }, { quoted: m });

        const player1 = m.sender;
        const player2 = m.mentionedJid[0];

        if (games[chatId]) return conn.sendMessage(chatId, { text: '❌ Una partita è già in corso in questo gruppo!' }, { quoted: m });

        // inizializza partita con coordinate nelle celle
        games[chatId] = {
            board: [
                ['a1','a2','a3'],
                ['b1','b2','b3'],
                ['c1','c2','c3']
            ],
            players: [player1, player2],
            turn: 0
        };

        await sendBoard(chatId, m, games[chatId], `🎮 Partita iniziata!\n${'@' + player1.split('@')[0]} (❌) VS ${'@' + player2.split('@')[0]} (⭕)\nTocca a @${games[chatId].players[0].split('@')[0]}`);
    }

    else if (text.startsWith(usedPrefix + 'putris')) {
        const game = games[chatId];
        if (!game) return conn.sendMessage(chatId, { text: '❌ Nessuna partita in corso! Usa .tris @utente per iniziare' }, { quoted: m });

        const player = m.sender;
        if (player !== game.players[game.turn]) return conn.sendMessage(chatId, { text: '❌ Non è il tuo turno!' }, { quoted: m });

        const args = text.split(' ').slice(1);
        if (args.length === 0) return conn.sendMessage(chatId, { text: '⚠️ Devi specificare la posizione (es: a1, b2...)' }, { quoted: m });

        const pos = args[0].toLowerCase();
        const map = { a:0, b:1, c:2 };
        const row = map[pos[0]];
        const col = parseInt(pos[1])-1;

        if (row === undefined || col < 0 || col > 2) return conn.sendMessage(chatId, { text: '⚠️ Posizione non valida! (a1-c3)' }, { quoted: m });
        if (['❌','⭕'].includes(game.board[row][col])) return conn.sendMessage(chatId, { text: '❌ Casella già occupata!' }, { quoted: m });

        const symbol = game.turn === 0 ? '❌' : '⭕';
        game.board[row][col] = symbol;

        // Controllo vittoria
        if (checkWinner(game.board)) {
            await sendBoard(chatId, m, game, `🎉 @${player.split('@')[0]} ha vinto!`);
            delete games[chatId];
            return;
        }

        // Controllo pareggio
        if (game.board.flat().every(c => ['❌','⭕'].includes(c))) {
            await sendBoard(chatId, m, game, `🤝 Pareggio!`);
            delete games[chatId];
            return;
        }

        // Cambio turno
        game.turn = 1 - game.turn;
        const nextPlayer = game.players[game.turn];

        await sendBoard(chatId, m, game, `Tocca a @${nextPlayer.split('@')[0]}`);
    }

    else if (text.startsWith(usedPrefix + 'endtris')) {
        if (games[chatId]) {
            delete games[chatId];
            await conn.sendMessage(chatId, { text: '🛑 Partita terminata.' }, { quoted: m });
        } else {
            await conn.sendMessage(chatId, { text: '❌ Nessuna partita in corso.' }, { quoted: m });
        }
    }
};

// funzione per mostrare il tabellone con linee
async function sendBoard(chatId, m, game, msg) {
    let rows = game.board.map(r => r.map(c => ['❌','⭕'].includes(c)?c:'⬜').join(' | '));
    let boardVisual = rows.join('\n---------\n');

    await m.conn.sendMessage(chatId, { 
        text: `${boardVisual}\n\n${msg}`, 
        mentions: game.players 
    }, { quoted: m });
}

function checkWinner(b) {
    for (let r=0;r<3;r++) if (['❌','⭕'].includes(b[r][0]) && b[r][0]===b[r][1] && b[r][1]===b[r][2]) return true;
    for (let c=0;c<3;c++) if (['❌','⭕'].includes(b[0][c]) && b[0][c]===b[1][c] && b[1][c]===b[2][c]) return true;
    if (['❌','⭕'].includes(b[0][0]) && b[0][0]===b[1][1] && b[1][1]===b[2][2]) return true;
    if (['❌','⭕'].includes(b[0][2]) && b[0][2]===b[1][1] && b[1][1]===b[2][0]) return true;
    return false;
}

handler.command = ["tris","putris","endtris"];
export default handler;