let flags = [
  { emoji: "🇮🇹", answers: ["italia"] },
  { emoji: "🇫🇷", answers: ["francia"] },
  { emoji: "🇩🇪", answers: ["germania"] },
  { emoji: "🇪🇸", answers: ["spagna"] },
  { emoji: "🇬🇧", answers: ["regno unito", "uk", "inghilterra"] },
  { emoji: "🇺🇸", answers: ["stati uniti", "usa", "america"] },
  { emoji: "🇯🇵", answers: ["giappone"] },
  { emoji: "🇨🇳", answers: ["cina"] },
  { emoji: "🇧🇷", answers: ["brasil", "brasile"] },
  { emoji: "🇦🇷", answers: ["argentina"] },
  { emoji: "🇨🇦", answers: ["canada"] },
  { emoji: "🇲🇽", answers: ["messico"] },
  { emoji: "🇷🇺", answers: ["russia"] },
  { emoji: "🇮🇳", answers: ["india"] },
  { emoji: "🇦🇺", answers: ["australia"] },
  { emoji: "🇰🇷", answers: ["corea del sud", "corea"] },
  { emoji: "🇿🇦", answers: ["sudafrica"] },
  { emoji: "🇪🇬", answers: ["egitto"] },
  { emoji: "🇵🇹", answers: ["portogallo"] },
  { emoji: "🇳🇱", answers: ["olanda", "paesi bassi"] },
  { emoji: "🇹🇷", answers: ["turchia"] },
  { emoji: "🇸🇪", answers: ["svezia"] },
  { emoji: "🇳🇴", answers: ["norvegia"] },
  { emoji: "🇫🇮", answers: ["finlandia"] },
  { emoji: "🇩🇰", answers: ["danimarca"] },
  { emoji: "🇧🇪", answers: ["belgio"] },
  { emoji: "🇨🇭", answers: ["svizzera"] },
  { emoji: "🇦🇹", answers: ["austria"] },
  { emoji: "🇵🇭", answers: ["filippine"] },
  { emoji: "🇮🇩", answers: ["indonesia"] },
  { emoji: "🇻🇳", answers: ["vietnam"] },
  { emoji: "🇹🇭", answers: ["tailandia"] },
  { emoji: "🇲🇾", answers: ["malesia"] },
  { emoji: "🇳🇬", answers: ["nigeria"] },
  { emoji: "🇰🇪", answers: ["kenya"] },
  { emoji: "🇺🇬", answers: ["uganda"] },
  { emoji: "🇨🇴", answers: ["colombia"] },
  { emoji: "🇨🇱", answers: ["cile"] },
  { emoji: "🇵🇪", answers: ["perù"] },
  { emoji: "🇻🇪", answers: ["venezuela"] },
  { emoji: "🇨🇺", answers: ["cuba"] },
  { emoji: "🇯🇲", answers: ["jamaica"] }
];

let game = {};
let leaderboard = {};

let handler = async (m, { conn, command }) => {
  let chat = m.chat;
  let user = m.sender;

  // CLASSIFICA
  if (command === 'classificabandiera') {
    if (!leaderboard[chat]) return m.reply('📉 Nessun dato per questo gruppo');
    let rank = Object.entries(leaderboard[chat])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    let text = `🏆 *CLASSIFICA BANDIERE* 🏆\n\n`;
    rank.forEach(([u, p], i) => text += `${i + 1}. @${u.split('@')[0]} → *${p}* punti\n`);
    return conn.sendMessage(chat, { text, mentions: rank.map(r => r[0]) });
  }

  // AVVIO GIOCO
  if (command === 'bandiera') {
    let flag = flags[Math.floor(Math.random() * flags.length)];
    let sent = await conn.sendMessage(chat, {
      text: `🌍 *INDOVINA LA BANDIERA!* 🌍\n\n${flag.emoji}\n\n📩 *Rispondi a questo messaggio con il nome dello Stato*`
    });
    game[chat] = { flag, answered: false, msgId: sent.key.id };
  }

  // SALTA PARTITA
  if (command === 'skipbandiera') {
    if (!game[chat]) return m.reply('❌ Nessuna partita in corso da saltare.');
    delete game[chat];

    let flag = flags[Math.floor(Math.random() * flags.length)];
    let sent = await conn.sendMessage(chat, {
      text: `⏩ *Partita saltata! Nuova bandiera!*\n\n🌍 ${flag.emoji}\n\n📩 *Rispondi a questo messaggio con il nome dello Stato*`
    });
    game[chat] = { flag, answered: false, msgId: sent.key.id };
  }
};

// RISPOSTE
handler.before = async (m, { conn }) => {
  if (!game[m.chat]) return;
  let data = game[m.chat];

  // controlla che il messaggio sia una risposta al messaggio del bot
  if (!m.quoted || m.quoted.key.id !== data.msgId) return;

  if (data.answered) return;
  if (!m.text) return;

  let risposta = m.text.toLowerCase().trim();
  if (data.flag.answers.includes(risposta)) {
    data.answered = true;
    leaderboard[m.chat] ??= {};
    leaderboard[m.chat][m.sender] = (leaderboard[m.chat][m.sender] || 0) + 1;

    await conn.sendMessage(m.chat, {
      text:
`🏆✨ *RISPOSTA CORRETTA!* ✨🏆

🌍 Bandiera: ${data.flag.emoji}
🎯 Stato: *${data.flag.answers[0].toUpperCase()}*

👏 @${m.sender.split('@')[0]}
🔥 Punto guadagnato!
📊 Totale punti: *${leaderboard[m.chat][m.sender]}*`,
      mentions: [m.sender]
    });
    delete game[m.chat];
  } else {
    await conn.sendMessage(m.chat, {
      text: `❌ *RISPOSTA SBAGLIATA!*\n\n🌍 Bandiera: ${data.flag.emoji}\n\n✍️ Scrivi un altro tentativo rispondendo al messaggio del bot`
    });
  }
};

handler.command = ['bandiera', 'skipbandiera', 'classificabandiera'];
handler.tags = ['game'];
handler.help = ['bandiera', 'skipbandiera', 'classificabandiera'];
handler.group = true;

export default handler;