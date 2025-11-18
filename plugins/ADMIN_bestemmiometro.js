import fetch from 'node-fetch'

const bestemmiaGradi = [
  { min: 1, max: 24, nome: "Peccatore Occasionale", emoji: "😐" },
  { min: 25, max: 49, nome: "Empio Recidivo", emoji: "😶‍🌫️" },
  { min: 50, max: 74, nome: "Blasfemo Iniziato", emoji: "🩸" },
  { min: 75, max: 99, nome: "Eretico Consacrato", emoji: "🔥" },
  { min: 100, max: 149, nome: "Scomunicato Ufficiale", emoji: "🕯️" },
  { min: 150, max: 299, nome: "Profanatore Supremo", emoji: "⚰️" },
  { min: 300, max: Infinity, nome: "Avatar della Bestemmia", emoji: "⛧" }
]

const bestemmieRegex =
/porco dio|porcodio|dio bastardo|dio cane|porcamadonna|madonnaporca|dio cristo|diocristo|dio maiale|diomaiale|cristo madonna|madonna impanata|dio frocio|dio gay|dio infuocato|dio crocifissato|madonna puttana|madonna vacca|madonna inculata|maremma maiala|jesu porco|diocane|padre pio|madonna troia|zoccola madonna|dio pentito/i

// Database locale
let db = {
  users: {},
  chats: {} // stato ON/OFF per gruppo
}

let handler = async (m, { conn, text, command, participants, isAdmin }) => {

  // ======= ON / OFF =======
  if (command === "bestemmiometro") {

    // Controllo: solo admin
    if (!isAdmin)
      return m.reply("⛔ Solo gli *amministratori del gruppo* possono attivare o disattivare il bestemmiometro.")

    if (!text)
      return m.reply("Usa:\n- `.bestemmiometro on`\n- `.bestemmiometro off`")

    if (text === "on") {
      db.chats[m.chat] = true
      return m.reply("✅ *Bestemmiometro attivato in questo gruppo!*")
    }

    if (text === "off") {
      db.chats[m.chat] = false
      return m.reply("❌ *Bestemmiometro disattivato in questo gruppo!*")
    }

    return m.reply("❗ Scrivi `on` o `off`")
  }

}

// Listener bestemmie
handler.all = async function (m) {
  if (!m.message || !m.text) return
  if (!m.isGroup) return
  if (!db.chats[m.chat]) return  // Se OFF → ignora

  const msg = m.text.toLowerCase()
  const sender = m.sender

  if (!bestemmieRegex.test(msg)) return

  if (!db.users[sender]) db.users[sender] = { blasphemy: 0 }
  let user = db.users[sender]
  user.blasphemy++

  const grado =
    bestemmiaGradi.find(g => user.blasphemy >= g.min && user.blasphemy <= g.max)
    || { nome: "Eresiarca Anonimo", emoji: "❓" }

  const testo = `ೋೋ═══•═══ೋೋ
📛 𝑼𝒕𝒆𝒏𝒕𝒆: @${sender.split('@')[0]}
📊 𝑪𝒐𝒏𝒕𝒆𝒈𝒈𝒊𝒐: *${user.blasphemy}*

🎖️ 𝑮𝒓𝒂𝒅𝒐: *${grado.nome}* ${grado.emoji}
ೋೋ═══•═══ೋೋ`

  await m.conn.sendMessage(m.chat, {
    text: testo,
    mentions: [sender]
  })
}

handler.help = ['bestemmiometro on/off']
handler.tags = ['tools']
handler.command = /^bestemmiometro$/i

export default handler
