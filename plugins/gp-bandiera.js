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

let game = {}
let leaderboard = {} // CLASSIFICA PER GRUPPO

let handler = async (m, { conn, command }) => {
  let chat = m.chat
  let user = m.sender

  // MOSTRA CLASSIFICA
  if (command === 'classificabandiera') {
    if (!leaderboard[chat]) return m.reply('📉 Nessun dato per questo gruppo')

    let rank = Object.entries(leaderboard[chat])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    let text = `🏆 *CLASSIFICA BANDIERE* 🏆\n\n`
    rank.forEach(([u, p], i) => {
      text += `${i + 1}. @${u.split('@')[0]} → *${p}* punti\n`
    })

    return conn.sendMessage(chat, {
      text,
      mentions: rank.map(r => r[0])
    }, { quoted: m })
  }

  // RISPOSTA
  if (m.quoted && game[chat]) {
    let risposta = m.text.toLowerCase().trim()
    let data = game[chat]

    if (data.answers.includes(risposta)) {
      leaderboard[chat] ??= {}
      leaderboard[chat][user] = (leaderboard[chat][user] || 0) + 1

      await conn.sendMessage(chat, {
        text:
`🏆✨ *RISPOSTA CORRETTA!* ✨🏆

🌍 Bandiera: ${data.emoji}
🎯 Stato: *${data.answers[0].toUpperCase()}*

👏 @${user.split('@')[0]}
🔥 Punto guadagnato!
📊 Totale punti: *${leaderboard[chat][user]}*`,
        mentions: [user]
      }, { quoted: m })

      delete game[chat]
      return
    }

    // ❌ RISPOSTA SBAGLIATA → BOTTONE
    await conn.sendMessage(chat, {
      text:
`❌ *RISPOSTA SBAGLIATA!*

🌍 Bandiera: ${data.emoji}
📌 Risposta corretta: *${data.answers[0].toUpperCase()}*

🔁 Vuoi riprovare subito?`,
      buttons: [
        { buttonId: '.bandiera', buttonText: { displayText: '🔁 Riprova' }, type: 1 }
      ],
      headerType: 1
    }, { quoted: m })

    delete game[chat]
    return
  }

  // AVVIO GIOCO
  let flag = flags[Math.floor(Math.random() * flags.length)]
  game[chat] = flag

  await conn.sendMessage(chat, {
    text:
`🌍 *INDOVINA LA BANDIERA!* 🌍

${flag.emoji}

📩 *Rispondi a questo messaggio*
✍️ Scrivi il nome dello Stato`
  }, { quoted: m })
}

handler.command = ['bandiera', 'classificabandiera']
handler.tags = ['game']
handler.help = ['bandiera', 'classificabandiera']

export default handler