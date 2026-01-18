let handler = async (m, { conn, text, participants }) => {
  try {
    const delay = (ms) => new Promise(res => setTimeout(res, ms))

    if (!text) {
      return m.reply("𝐒𝐜𝐫𝐢𝐯𝐢 𝐢𝐥 𝐦𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨 𝐢𝐧𝐬𝐢𝐞𝐦𝐞 𝐚𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨!")
    }

    // Prende tutti i membri del gruppo
    let users = participants.map(u => conn.decodeJid(u.id))

    // Carattere invisibile
    let invisibleChar = '\u200b'
    let invisibleText = invisibleChar.repeat(500)

    // Funzione hidetag invisibile
    const sendHidetagMessage = async (message) => {
      await conn.relayMessage(m.chat, {
        extendedTextMessage: {
          text: `${invisibleText}\n${message}`,
          contextInfo: {
            mentionedJid: users
          }
        }
      }, {})
    }

    // Invia 20 messaggi
    for (let i = 0; i < 20; i++) {
      await sendHidetagMessage(text)
      await delay(1500) // delay anti-ban
    }

  } catch (e) {
    console.error(e)
  }
}

handler.command = /^(bigtag2)$/i
handler.group = true
handler.rowner = true

export default handler