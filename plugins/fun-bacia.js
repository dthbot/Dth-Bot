let handler = async (m, { conn, text, command, usedPrefix }) => {

  // Normalizza il testo
  text = text?.trim()

  // Caso: .bacia @  → deve essere una risposta
  if (text === '@') {
    if (m.quoted?.sender) {
      m.mentionedJid = [m.quoted.sender]
    } else {
      return conn.reply(
        m.chat,
        `💋 Devi rispondere a un messaggio per usare *${usedPrefix + command} @*`,
        m
      )
    }
  }

  // Caso: niente testo
  if (!text) {
    if (m.quoted?.sender) {
      m.mentionedJid = [m.quoted.sender]
    } else {
      return conn.reply(
        m.chat,
        `💋 Devi menzionare qualcuno o rispondere a un messaggio!\n\nEsempi:\n${usedPrefix + command} @utente\n${usedPrefix + command} @ (rispondendo)`,
        m
      )
    }
  }

  let utentiMenzionati = m.mentionedJid || []

  if (!utentiMenzionati.length) {
    return m.reply('💋 *Devi indicare qualcuno da baciare!*')
  }

  const baciatore = m.sender
  const baciato = utentiMenzionati[0]

  // Impedisce di baciare se stessi
  if (baciatore === baciato) {
    return m.reply('😳 Non puoi baciare te stesso!')
  }

  const tagBaciatore = '@' + baciatore.split('@')[0]
  const tagBaciato = '@' + baciato.split('@')[0]

  const messaggio = `
💖 *Momento romantico* 💖

💋 ${tagBaciatore}  *si avvicina con un sorriso  
e dà un limone hard a*  ${tagBaciato} 😘✨

💕 *L’amore è nell’aria!* 💕
`.trim()

  await conn.sendMessage(
    m.chat,
    {
      text: messaggio,
      mentions: [baciatore, baciato]
    },
    { quoted: m }
  )
}

handler.command = ['bacia']
handler.group = true

export default handler
