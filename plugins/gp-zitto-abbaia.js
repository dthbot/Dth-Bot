// gp-accuccia-abbaia.js
// Plugin Baileys - Comandi .accuccia / .abbaia
// SOLO admin del gruppo possono usarli
// ES MODULE

import makeWASocket from '@adiwajshing/baileys'
import {
  useSingleFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from '@adiwajshing/baileys'
import pino from 'pino'

// 🔸 Stato auth
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

// 🔸 Lista utenti mutati (globale)
let mutedUsers = []

async function start() {
  const { version } = await fetchLatestBaileysVersion().catch(() => ({
    version: [2, 3000, 10]
  }))

  const sock = makeWASocket({
    logger: pino({ level: 'info' }),
    printQRInTerminal: true,
    auth: state,
    version
  })

  sock.ev.on('creds.update', saveState)

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      if (code !== DisconnectReason.loggedOut) start()
      else console.log('❌ Disconnesso. Cancella auth_info_multi.json per rifare il login.')
    } else if (connection === 'open') {
      console.log('✅ Plugin accuccia/abbaia attivo (solo admin).')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    try {
      if (!messages || type !== 'notify') return
      const msg = messages[0]
      if (!msg.message || msg.key.remoteJid === 'status@broadcast') return

      const from = msg.key.remoteJid
      if (!from.endsWith('@g.us')) return

      const sender = msg.key.participant
      let text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        ''

      text = text.trim().toLowerCase()

      // 🔇 Se mutato → elimina messaggio
      if (mutedUsers.includes(sender)) {
        await sock.sendMessage(from, { delete: msg.key })
        return
      }

      // 🔸 Comandi validi
      if (!text.startsWith('.accuccia') && !text.startsWith('.abbaia')) return

      // 🔹 Controllo admin
      const metadata = await sock.groupMetadata(from)
      const groupAdmins = metadata.participants
        .filter(p => p.admin)
        .map(p => p.id)

      if (!groupAdmins.includes(sender)) {
        await sock.sendMessage(from, {
          text: '🚫 Solo gli *admin* possono usare questo comando.'
        })
        return
      }

      // 🔹 Target (reply o mention)
      let target
      const ctx = msg.message.extendedTextMessage?.contextInfo

      if (ctx?.participant) target = ctx.participant
      else if (ctx?.mentionedJid?.[0]) target = ctx.mentionedJid[0]
      else {
        await sock.sendMessage(from, {
          text: '❗ Usa il comando rispondendo a un messaggio o menzionando un utente.'
        })
        return
      }

      // 🔹 .accuccia (muta)
      if (text.startsWith('.accuccia')) {
        if (mutedUsers.includes(target)) {
          await sock.sendMessage(from, {
            text: `🤐 @${target.split('@')[0]} è già accucciato.`,
            mentions: [target]
          })
          return
        }

        mutedUsers.push(target)
        await sock.sendMessage(from, {
          text: `🛑 @${target.split('@')[0]} è stato messo *A CUCCIA*.`,
          mentions: [target]
        })
      }

      // 🔹 .abbaia (smuta)
      else {
        if (!mutedUsers.includes(target)) {
          await sock.sendMessage(from, {
            text: `🐶 @${target.split('@')[0]} non era a cuccia.`,
            mentions: [target]
          })
          return
        }

        mutedUsers = mutedUsers.filter(u => u !== target)
        await sock.sendMessage(from, {
          text: `🗣️ @${target.split('@')[0]} può *ABBAIARE* di nuovo.`,
          mentions: [target]
        })
      }

    } catch (err) {
      console.error('❌ Errore plugin accuccia/abbaia:', err)
    }
  })
}

start()
