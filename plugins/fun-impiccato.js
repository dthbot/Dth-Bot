let handler = async (m, { conn, command }) => {

  conn.impiccato = conn.impiccato || {};

  if (conn.impiccato[m.chat]) {
    return m.reply('🎮 C\'è già una partita in corso!\nRispondi al messaggio del bot.');
  }

  // Lista di parole più lunga
  const words = [
    'javascript', 'nodejs', 'programmazione', 'developer', 'bot',
    'hangman', 'python', 'java', 'react', 'angular', 'vue', 
    'typescript', 'html', 'css', 'database', 'mongodb', 'sql',
    'algorithm', 'function', 'variable', 'object', 'array', 'loop',
    'debug', 'compile', 'server', 'client', 'api', 'frontend', 'backend'
  ];

  const chosenWord = words[Math.floor(Math.random() * words.length)];

  let game = {
    word: chosenWord,
    guessed: Array(chosenWord.length).fill('_'),
    attempts: 6,
    wrong: [],
    starter: m.sender
  };

  conn.impiccato[m.chat] = game;

  let text =
`🎮 *GIOCO DELL’IMPICCATO* 🎮

${game.guessed.join(' ')}

❤️ Tentativi: ${game.attempts}
❌ Errori: ${game.wrong.join(', ') || 'Nessuno'}

📩 *Rispondi a questo messaggio* con una lettera o con la parola`;

  let sent = await conn.reply(m.chat, text, m);
  game.msgId = sent.key.id;

  setTimeout(() => {
    if (conn.impiccato[m.chat]) {
      delete conn.impiccato[m.chat];
      conn.reply(m.chat, `⏳ Tempo scaduto!\nLa parola era *${chosenWord}*`);
    }
  }, 60000);
};

// === GESTIONE RISPOSTE ===
handler.before = async (m, { conn }) => {
  conn.impiccato = conn.impiccato || {};
  let game = conn.impiccato[m.chat];
  if (!game) return;

  if (!m.quoted || m.quoted.id !== game.msgId) return;

  if (m.sender !== game.starter) return;

  let input = m.text.toLowerCase().trim();
  if (!input) return;

  if (input.length > 1) {
    if (input === game.word) {
      delete conn.impiccato[m.chat];
      return conn.reply(m.chat, `🎉 *HAI VINTO!*\nLa parola era *${game.word}*`);
    } else {
      game.attempts--;
    }
  } else {
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

  if (game.guessed.join('') === game.word) {
    delete conn.impiccato[m.chat];
    return conn.reply(m.chat, `🎉 *HAI VINTO!*\nLa parola era *${game.word}*`);
  }

  if (game.attempts <= 0) {
    delete conn.impiccato[m.chat];
    return conn.reply(m.chat, `💀 *HAI PERSO!*\nLa parola era *${game.word}*`);
  }

  let update =
`🎮 *IMPICCATO* 🎮

${game.guessed.join(' ')}

❤️ Tentativi: ${game.attempts}
❌ Errori: ${game.wrong.join(', ') || 'Nessuno'}

📩 Rispondi a questo messaggio`;

  conn.reply(m.chat, update);
};

handler.command = /^impiccato$/i;
handler.tags = ['game'];
handler.help = ['impiccato'];

export default handler;
