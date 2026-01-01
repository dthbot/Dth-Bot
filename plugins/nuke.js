import { promises as fs } from 'fs'
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var handler = async (m, { conn, participants }) => {
  try {
    const owners = new Set(
      (global.owner || [])
        .flatMap(v => {
          if (typeof v === 'string') return [v]
          if (Array.isArray(v)) return v.filter(x => typeof x === 'string')
          return []
        })
        .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    )

    const botJid = conn.user.jid
    const partecipanti = participants.map(p => p.id)
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    const chat = global.db.data.chats[m.chat]
    chat.detect = false
    chat.welcome = false

    // Demote admin eccetto owner e bot
    const toDemote = participants
      .filter(p => p.admin && !owners.has(p.id) && p.id !== botJid)
      .map(p => p.id)
    if (toDemote.length > 0) {
      await conn.groupParticipantsUpdate(m.chat, toDemote, 'demote').catch(() => {})
      await delay(1500)
    }

    const gruppo = global.db.data.settings?.linkHado || 'https://whatsapp.com/channel/0029VbB41Sa1Hsq1JhsC1Z1z'

    // Aggiorna nome gruppo
    await conn.groupUpdateSubject(m.chat, 'svt by ✧˚🩸 varebot 🕊️˚✧')
    await delay(1500)

    // Aggiorna descrizione gruppo
    await conn.groupUpdateDescription(m.chat, `🈵 Nuovo gruppo: ${gruppo}\n-> entra anche nel canale:\n https://whatsapp.com/channel/0029VbB41Sa1Hsq1JhsC1Z1z`)
    await delay(1500)

    // Rimuove tutti i partecipanti (eccetto owner e bot)
    const groupNoAdmins = participants
      .filter(p => !owners.has(p.id) && p.id !== botJid && p.id !== m.sender)
      .map(p => p.id)

    if (groupNoAdmins.length > 0) {
      for (let user of groupNoAdmins) {
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove').catch(() => {})
        await delay(1500) // delay tra ogni rimozione
      }
    }

  } catch (e) {
    console.error(e)
    return m.reply(`*❌ ERRORE*\n━━━━━━━━━━━━━━━━\n\n*⚠️ Si è verificato un errore durante l'esecuzione del comando*`)
  }
}

handler.command = /^hado90$/i
handler.group = true
handler.rowner = true
handler.botAdmin = true

export default handler