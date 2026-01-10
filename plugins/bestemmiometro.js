// BESTEMMIO METRO 😇➡️😈
// Plugin con ON/OFF - solo conteggio punti

const bestemmieRegex = /(porco dio|porcodio|dio bastardo|dio cane|porcamadonna|madonnaporca|dio cristo|diocristo|dio maiale|diomaiale|cristo madonna|madonna impanata|dio frocio|dio gay|dio infuocato|dio crocifissato|madonna puttana|madonna vacca|madonna inculata|maremma maiala|jesu porco|diocane|padre pio|madonna troia|zoccola madonna|dio pentito)/i

// ───── COMANDO ON / OFF ─────
let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(
      m.chat,
      '⚠️ Usa:\n• `.attiva bestemmiometro`\n• `.disattiva bestemmiometro`',
      m
    )
  }

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  if (args[0].toLowerCase() === 'bestemmiometro') {
    chat.bestemmiometro = true
    await conn.reply(m.chat, '✅ *BestemmioMetro ATTIVATO* 😈📊', m)
  }
}

// Alias off separato
handler.command = ['attiva']
handler.admin = true
handler.group = true

// ───── DISATTIVA ─────
handler.before = async function (m, { conn, isAdmin }) {
  if (!m.text || !m.isGroup) return true

  let chat = global.db.data.chats[m.chat]
  if (!chat) global.db.data.chats[m.chat] = {}

  // DISATTIVA comando
  if (m.text.toLowerCase() === '.disattiva bestemmiometro') {
    if (!isAdmin) return true
    chat.bestemmiometro = false
    await conn.reply(m.chat, '❌ *BestemmioMetro DISATTIVATO* 🙏', m)
    return false
  }

  // Se non attivo, esce
  if (!chat.bestemmiometro) return true
  if (m.isBaileys || m.fromMe) return true
  if (isAdmin) return true
  if (!bestemmieRegex.test(m.text)) return true

  // ───── CONTEGGIO ─────
  let user = global.db.data.users[m.sender]
  if (!user.bestemmie) user.bestemmie = 0

  user.bestemmie += 1

  await conn.sendMessage(m.chat, {
    text:
`🚨 *BESTEMMIO METRO* 🚨

👤 Utente: @${m.sender.split('@')[0]}
📊 Totale bestemmie: *${user.bestemmie}*

😇 Dio prende appunti...`,
    mentions: [m.sender]
  })

  return true
}

export default handler