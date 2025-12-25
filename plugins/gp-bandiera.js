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
  { emoji: "🇳🇱", answers: ["olanda", "paesi bassi"] }
]

let game = {} // partita attiva per chat
let leaderboard = {} // punti per chat

let handler = async (m, { conn, command }) => {
  let chat = m.chat
  let user = m.sender

  // CLASSIFICA
  if (command === 'classificabandiera') {
    if (!leaderboard[chat]) return m.reply('📉 Nessun dato per questo gruppo')

    let rank = Object.entries(leaderboard[chat])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    let text = `🏆 *CLASSIFICA BANDIERE* 🏆\n\n`
    rank.forEach(([u, p], i) => {
      text += `${i + 1}. @${u.split('@')[0]} → *${p}* punti\n`
    })

    return conn.sendMessage(chat, { text, mentions: rank.map(r => r[0]) })
  }

  // NUOVA PARTITA
  if (command === 'bandiera') {
    let flag = flags[Math.floor(Math.random() * flags.length)]
    game[chat] = { flag, answered: false }

    return conn.sendMessage(chat, {
      text:
`🌍 *INDOVINA LA BANDIERA!* 🌍

${flag.emoji}

📩 *Scrivi il nome dello Stato*`
    })
  }
}

// RISPOSTE
handler.all = async (m, { conn }) => {
  let chat = m.chat
  let user = m.sender
  if (!game[chat]) return

  let data = game[chat]
  if (data.answered) return // già risposto

  let risposta = m.text.toLowerCase().trim()
  if (data.flag.answers.includes(risposta)) {
    data.answered = true
    leaderboard[chat] ??= {}
    leaderboard[chat][user] = (leaderboard[chat][user] || 0) + 1

    await conn.sendMessage(chat, {
      text:
`🏆✨ *RISPOSTA CORRETTA!* ✨🏆

🌍 Bandiera: ${data.flag.emoji}
🎯 Stato: *${data.flag.answers[0].toUpperCase()}*

👏 @${user.split('@')[0]}
🔥 Punto guadagnato!
📊 Totale punti: *${leaderboard[chat][user]}*`,
      mentions: [user]
    })

    delete game[chat]
  } else {
    await conn.sendMessage(chat, {
      text:
`❌ *RISPOSTA SBAGLIATA!*

🌍 Bandiera: ${data.flag.emoji}

✍️ Scrivi un altro tentativo!`
    })
  }
}

handler.command = ['bandiera', 'classificabandiera']
handler.tags = ['game']
handler.help = ['bandiera', 'classificabandiera']

export default handler