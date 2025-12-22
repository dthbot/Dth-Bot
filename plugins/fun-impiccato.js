handler.before = async (m, { conn }) => {
  conn.impiccato = conn.impiccato || {};
  let game = conn.impiccato[m.chat];
  if (!game) return;

  // Solo chi ha iniziato può rispondere
  if (m.sender !== game.starter) return;

  let input = m.text.toLowerCase().trim();
  if (!input) return;

  // Tentativo parola intera
  if (input.length > 1) {
    if (input === game.word) {
      delete conn.impiccato[m.chat];
      return conn.reply(m.chat, `🎉 *HAI VINTO!*\nLa parola era *${game.word}*`);
    } else {
      game.attempts--;
    }
  } else {
    // Tentativo lettera
    if (game.wrong.includes(input) || game.guessed.includes(input)) {
      return m.reply('❌ Lettera già usata!');
    }

    if (game.word.includes(input)) {
      for (let i = 0; i < game.word.length; i++) {
        if (game.word[i] === input) game.guessed[i] = input;
      }
    } else {
      game.wrong.push(input);
      game.attempts--;
    }
  }

  // Controllo vittoria
  if (game.guessed.join('') === game.word) {
    delete conn.impiccato[m.chat];
    return conn.reply(m.chat, `🎉 *HAI VINTO!*\nLa parola era *${game.word}*`);
  }

  // Controllo sconfitta
  if (game.attempts <= 0) {
    delete conn.impiccato[m.chat];
    return conn.reply(m.chat, `💀 *HAI PERSO!*\nLa parola era *${game.word}*`);
  }

  // Aggiorna lo stato
  let update =
`🎮 *IMPICCATO* 🎮

${game.guessed.join(' ')}

❤️ Tentativi: ${game.attempts}
❌ Errori: ${game.wrong.join(', ') || 'Nessuno'}

📩 Rispondi a questo messaggio (o a qualsiasi messaggio della partita)`;

  // Invia aggiornamento
  let sent = await conn.reply(m.chat, update);
  // Salva l'ultimo ID del messaggio per eventuali riferimenti futuri
  game.msgId = sent.key.id;
};
