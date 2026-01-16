// ====== BANDIERA EMOJI GAME (REPLY FIXED) ======

global.bandieraEmojiGame = global.bandieraEmojiGame || {}
global.bandieraEmojiLeaderboard = global.bandieraEmojiLeaderboard || {}

const flags = [
  { emoji: "🇮🇹", answers: ["italia"] },
  { emoji: "🇫🇷", answers: ["francia"] },
  { emoji: "🇩🇪", answers: ["germania"] },
  { emoji: "🇪🇸", answers: ["spagna"] },
  { emoji: "🇬🇧", answers: ["regno unito", "inghilterra", "uk"] },
  { emoji: "🇺🇸", answers: ["stati uniti", "usa", "america"] },
  { emoji: "🇨🇦", answers: ["canada"] },
  { emoji: "🇧🇷", answers: ["brasile", "brasil"] },
  { emoji: "🇦🇷", answers: ["argentina"] },
  { emoji: "🇲🇽", answers: ["messico"] },
  { emoji: "🇨🇱", answers: ["cile"] },
  { emoji: "🇨🇴", answers: ["colombia"] },
  { emoji: "🇵🇪", answers: ["peru", "perù"] },
  { emoji: "🇻🇪", answers: ["venezuela"] },
  { emoji: "🇯🇵", answers: ["giappone"] },
  { emoji: "🇨🇳", answers: ["cina"] },
  { emoji: "🇰🇷", answers: ["corea del sud", "corea"] },
  { emoji: "🇮🇳", answers: ["india"] },
  { emoji: "🇦🇺", answers: ["australia"] },
  { emoji: "🇳🇿", answers: ["nuova zelanda"] },
  { emoji: "🇿🇦", answers: ["sudafrica"] },
  { emoji: "🇪🇬", answers: ["egitto"] },
  { emoji: "🇳🇬", answers: ["nigeria"] },
  { emoji: "🇰🇪", answers: ["kenya"] },
  { emoji: "🇺🇬", answers: ["uganda"] },
  { emoji: "🇷🇺", answers: ["russia"] },
  { emoji: "🇹🇷", answers: ["turchia"] },
  { emoji: "🇸🇦", answers: ["arabia saudita"] },
  { emoji: "🇮🇱", answers: ["israele"] },
  { emoji: "🇵🇹", answers: ["portogallo"] },
  { emoji: "🇳🇱", answers: ["olanda", "paesi bassi"] },
  { emoji: "🇸🇪", answers: ["svezia"] },
  { emoji: "🇳🇴", answers: ["norvegia"] },
  { emoji: "🇫🇮", answers: ["finlandia"] },
  { emoji: "🇩🇰", answers: ["danimarca"] },
  { emoji: "🇨🇭", answers: ["svizzera"] },
  { emoji: "🇦🇹", answers: ["austria"] },
  { emoji: "🇧🇪", answers: ["belgio"] },
  { emoji: "🇬🇷", answers: ["grecia"] },
  { emoji: "🇵🇱", answers: ["polonia"] },
  { emoji: "🇨🇿", answers: ["repubblica ceca"] },
  { emoji: "🇭🇺", answers: ["ungheria"] },
  { emoji: "🇷🇴", answers: ["romania"] },
  { emoji: "🇧🇬", answers: ["bulgaria"] },
  { emoji: "🇺🇦", answers: ["ucraina"] },
  { emoji: "🇷🇸", answers: ["serbia"] },
  { emoji: "🇭🇷", answers: ["croazia"] },
  { emoji: "🇸🇮", answers: ["slovenia"] },
  { emoji: "🇸🇰", answers: ["slovacchia"] },
  { emoji: "🇮🇪", answers: ["irlanda"] },
  { emoji: "🇮🇸", answers: ["islanda"] }
]

// ===== UTILS =====
function normalize(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

function similarity(a, b) {
  const wa = a.split(' ')
  const wb = b.split(' ')
  const matches = wa.filter(w =>
    wb.some(x => x.includes(w) || w.includes(x))
  )
  return matches.length / Math.max(wa.length, wb.length)
}

// ===== COMMAND HANDLER =====
let handler = async (m, { conn, command, isAdmin }) => {
  const chat = m.chat

  // CLASSIFICA
  if (command === 'classificabandiera') {
    const lb = global.bandieraEmojiLeaderboard[chat]
    if (!lb) return m.reply('📉 Nessun dato disponibile')

    let rank = Object.entries(lb)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    let text = '🏆 *CLASSIFICA BANDIERE*\n\n'
    rank.forEach(([u, p], i) => {
      text += `${i + 1}. @${u.split('@')[0]} → *${p}* punti\n`
    })

    return conn.sendMessage(chat, {
      text,
      mentions: rank.map(r => r[0])
    })
  }

  // SKIP
  if (command === 'skipbandiera') {
    if (!global.bandieraEmojiGame[chat])
      return m.reply('❌ Nessuna partita attiva')

    if (!isAdmin && !m.fromMe)
      return m.reply('❌ Solo admin')

    clearTimeout(global.bandieraEmojiGame[chat].timeout)
    let r = global.bandieraEmojiGame[chat].flag.answers[0]
    delete global.bandieraEmojiGame[chat]

    return m.reply(`⏩ *Partita saltata*\n🎯 Risposta: *${r.toUpperCase()}*`)
  }

  // AVVIO GIOCO
  if (command === 'bandiera') {
    if (global.bandieraEmojiGame[chat])
      return m.reply('⚠️ C’è già una partita attiva')

    const flag = flags[Math.floor(Math.random() * flags.length)]

    const msg = await conn.sendMessage(chat, {
      text:
`🌍 *INDOVINA LA BANDIERA* 🌍

${flag.emoji}

📩 *Rispondi a QUESTO messaggio*
⏱️ *Tempo: 30 secondi*`
    })

    global.bandieraEmojiGame[chat] = {
      messageId: msg.key.id,
      flag,
      tentativi: {},
      suggerito: false,
      timeout: setTimeout(() => {
        if (global.bandieraEmojiGame[chat]) {
          conn.reply(
            chat,
            `⏳ *Tempo scaduto!*\n🎯 Risposta: *${flag.answers[0].toUpperCase()}*`,
            msg
          )
          delete global.bandieraEmojiGame[chat]
        }
      }, 30000)
    }
  }
}

// ===== REPLY HANDLER (FIX DEFINITIVO) =====
handler.before = async (m, { conn }) => {
  const chat = m.chat
  const game = global.bandieraEmojiGame[chat]

  if (!game) return
  if (!m.quoted) return
  if (!m.quoted.key) return
  if (m.quoted.key.id !== game.messageId) return
  if (!m.text) return

  const userAnswer = normalize(m.text)
  const correctAnswer = normalize(game.flag.answers[0])
  const sim = similarity(userAnswer, correctAnswer)

  game.tentativi[m.sender] ??= 0
  if (game.tentativi[m.sender] >= 3)
    return conn.reply(chat, '❌ Tentativi esauriti', m)

  if (userAnswer === correctAnswer || sim >= 0.8) {
    clearTimeout(game.timeout)

    global.bandieraEmojiLeaderboard[chat] ??= {}
    global.bandieraEmojiLeaderboard[chat][m.sender] =
      (global.bandieraEmojiLeaderboard[chat][m.sender] || 0) + 1

    await conn.sendMessage(chat, {
      text:
`🏆 *RISPOSTA CORRETTA!*

🌍 ${game.flag.emoji}
🎯 *${game.flag.answers[0].toUpperCase()}*

🔥 Punti totali: *${global.bandieraEmojiLeaderboard[chat][m.sender]}*`,
      mentions: [m.sender]
    })

    delete global.bandieraEmojiGame[chat]
  } else if (sim >= 0.6 && !game.suggerito) {
    game.suggerito = true
    conn.reply(chat, '👀 *Ci sei quasi!*', m)
  } else {
    game.tentativi[m.sender]++
    let r = game.flag.answers[0]
    if (game.tentativi[m.sender] === 2) {
      conn.reply(
        chat,
        `💡 *Suggerimento*\nInizia con *${r[0].toUpperCase()}* • ${r.length} lettere`,
        m
      )
    } else {
      conn.reply(chat, '❌ Risposta errata, riprova!', m)
    }
  }
}

handler.command = ['bandiera', 'skipbandiera', 'classificabandiera']
handler.tags = ['game']
handler.help = handler.command
handler.group = true

export default handler