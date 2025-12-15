// gp-accuccia-abbaia.js
// Plugin - .accuccia / .abbaia
// Solo owner possono usarlo, mute per gruppo con salvataggio su JSON

import fs from 'fs'
import path from 'path'
import { owners } from '../config.js'

const DATA_FILE = path.join('./database', 'mutedUsers.json')

// Carica mute persistenti
let mutedGroups = {}
if (fs.existsSync(DATA_FILE)) {
  mutedGroups = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
}

// Salva mute persistenti
const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(mutedGroups, null, 2))
}

let handler = async (m, { conn, command }) => {
  if (!m.isGroup) return

  // 🔹 Controllo owner
  if (!owners.includes(m.sender)) {
    return m.reply('🚫 Solo gli *owner* possono usare questo comando.')
  }

  const chatId = m.chat
  if (!mutedGroups[chatId]) mutedGroups[chatId] = []

  // 🎯 Target: reply o mention
  let target = m.mentionedJid?.[0] || m.quoted?.sender
  if (!target) return m.reply('❗ Usa il comando rispondendo a un messaggio o menzionando un utente.')
  if (target === m.sender) return m.reply('😐 Non puoi farlo su te stesso.')

  // 🔹 .accuccia
  if (command === 'accuccia') {
    if (mutedGroups[chatId].includes(target)) {
      return conn.sendMessage(chatId, { text: `🤐 @${target.split('@')[0]} è già a cuccia.`, mentions: [target] }, { quoted: m })
    }

    mutedGroups[chatId].push(target)
    saveData()
    return conn.sendMessage(chatId, { text: `🛑 @${target.split('@')[0]} è stato messo *A CUCCIA*. 🐕`, mentions: [target] }, { quoted: m })
  }

  // 🔹 .abbaia
  if (command === 'abbaia') {
    if (!mutedGroups[chatId].includes(target)) {
      return conn.sendMessage(chatId, { text: `🐶 @${target.split('@')[0]} non era a cuccia.`, mentions: [target] }, { quoted: m })
    }

    mutedGroups[chatId] = mutedGroups[chatId].filter(u => u !== target)
    saveData()
    return conn.sendMessage(chatId, { text: `🔊 @${target.split('@')[0]} può *ABBAIARE* di nuovo!`, mentions: [target] }, { quoted: m })
  }
}

// 🔇 Blocca i messaggi degli utenti mutati
handler.before = async (m) => {
  if (!m.isGroup) return
  const chatId = m.chat
  if (mutedGroups[chatId]?.includes(m.sender)) {
    await m.delete()
    return true
  }
}

handler.command = ['accuccia', 'abbaia']
handler.group = true

export default handler
