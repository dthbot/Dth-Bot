// zitto.js
// Plugin Baileys - Comandi .zitto / .abbaia
// SOLO admin del gruppo possono usarli

const makeWASocket = require('@adiwajshing/baileys').default
const { useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@adiwajshing/baileys')
const pino = require('pino')

const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

// 🔸 Lista utenti mutati
let mutedUsers = []

async function start() {
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 10] }))
  const sock = makeWASocket({
    logger: pino({ level: 'info' }),
    printQRInTerminal: true,
    auth: state,
    version
  })

  sock.ev.on('creds.update', saveState)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      if (code !== DisconnectReason.loggedOut) start()
      else console.log('Disconnesso. Cancella auth_info_multi.json per rifare il login.')
    } else if (connection === 'open') {
      console.log('✅ Plugin zitto/abbaia attivo (solo admin).')
    }
  })

  sock.ev.on('messages.upsert', async (m) => {
    try {
      if (!m.messages || m.type !== 'notify') return
      const msg = m.messages[0]
      if (!msg.message || msg.key.remoteJid === 'status@broadcast') return

      const from = msg.key.remoteJid
      if (!from.endsWith('@g.us')) return

      const sender = msg.key.participant || msg.key.remoteJid
      let text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        ''

      text = text.trim().toLowerCase()

      // 🔸 Se mutato → elimina messaggio
      if (mutedUsers.includes(sender)) {
        await sock.sendMessage(from, { delete: msg.key })
        return
      }

      // 🔸 Comandi validi
      if (!text.startsWith('.zitto') && !text.startsWith('.abbaia')) return

      // 🔹 Controllo admin
      const metadata = await sock.groupMetadata(from)
      const groupAdmins = metadata.participants
        .filter(p => p.admin)
        .map(p => p.id)

      if (!groupAdmins.includes(sender)) {
        await sock.sendMessage(
          from,
          { text: '🚫 Solo gli *admin* possono usare questo comando.' },
          { quoted: msg }
        )
        return
      }

      // 🔹 Target (reply o mention)
      let target
      const ctx = msg.message.extendedTextMessage?.contextInfo

      if (ctx?.participant) {
        target = ctx.participant
      } else if (ctx?.mentionedJid?.[0]) {
        target = ctx.mentionedJid[0]
      } else {
        await sock.sendMessage(
          from,
          { text: '❗ Usa il comando rispondendo a un messaggio o menzionando un utente.' },
          { quoted: msg }
        )
        return
      }

      // 🔹 .zitto (muta)
      if (text.startsWith('.zitto')) {
        if (mutedUsers.includes(target)) {
          await sock.sendMessage(
            from,
            { text: `🤐 @${target.split('@')[0]} è già zitto.`, mentions: [target] },
            { quoted: msg }
          )
          return
        }

        mutedUsers.push(target)
        await sock.sendMessage(
          from,
          { text: `🔇 @${target.split('@')[0]} ora è *ZITTO*.`, mentions: [target] },
          { quoted: msg }
        )
      }

      // 🔹 .abbaia (smuta)
      else if (text.startsWith('.abbaia')) {
        if (!mutedUsers.includes(target)) {
          await sock.sendMessage(
            from,
            { text: `🐶 @${target.split('@')[0]} non era zitto.`, mentions: [target] },
            { quoted: msg }
          )
          return
        }

        mutedUsers = mutedUsers.filter(u => u !== target)
        await sock.sendMessage(
          from,
          { text: `🗣️ @${target.split('@')[0]} può *ABBAIARE* di nuovo.`, mentions: [target] },
          { quoted: msg }
        )
      }

    } catch (err) {
      console.error('Errore nel plugin zitto/abbaia:', err)
    }
  })
}

start().catch(console.error)
