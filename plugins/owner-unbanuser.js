// unbanuser.js
import fs from 'fs'
import path from 'path'
import { owners } from '../config.js'

const DATA_FILE = path.join('./database', 'bannedUsers.json')

let bannedUsers = {}
if (fs.existsSync(DATA_FILE)) {
  bannedUsers = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
}

const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bannedUsers, null, 2))
}

let handler = async (m, { conn }) => {
  if (!m.isGroup) return

  if (!owners.includes(m.sender)) {
    return m.reply('🚫 Solo gli *owner* possono usare questo comando.')
  }

  const chatId = m.chat
  if (!bannedUsers[chatId]) bannedUsers[chatId] = []

  let target = m.mentionedJid?.[0] || m.quoted?.sender
  if (!target) return m.reply('❗ Usa il comando rispondendo a un messaggio o menzionando un utente.')
  if (target === m.sender) return m.reply('😐 Non puoi sbannare te stesso.')

  if (!bannedUsers[chatId].includes(target)) {
    return conn.sendMessage(chatId, { text: `✅ @${target.split('@')[0]} non era bannato.`, mentions: [target] }, { quoted: m })
  }

  bannedUsers[chatId] = bannedUsers[chatId].filter(u => u !== target)
  saveData()
  return conn.sendMessage(chatId, { text: `✅ @${target.split('@')[0]} è stato sbannato!`, mentions: [target] }, { quoted: m })
}

handler.before = async (m) => {
  if (!m.isGroup) return
  const chatId = m.chat
  if (bannedUsers[chatId]?.includes(m.sender)) {
    await m.delete()
    return true
  }
}

handler.command = ['unbanuser']
handler.group = true

export default handler
