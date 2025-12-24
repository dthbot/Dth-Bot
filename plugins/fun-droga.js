let handler = async (m, { conn }) => {

  // 👉 RISPOSTA AI BOTTONI (FIX)
  let btnId =
    m.message?.templateButtonReplyMessage?.selectedId ||
    m.message?.buttonsResponseMessage?.selectedButtonId

  if (btnId) {
    return conn.sendMessage(m.chat, {
      text:
`✅ VENDUTO

🚬 "${scelta}" È la tua scelta? Bene ne hai comprato 5 Grammi

🤪 GODITELI

💪 SI alle droghe`
    }, { quoted: m })
  }

  // 👉 COMANDO .droga
  await conn.sendMessage(m.chat, {
    text: `🤔 *Che droga vuoi prendere?*`,
    buttons: [
      { buttonId: 'Oppio', buttonText: { displayText: '⚗️ Oppio' }, type: 1 },
      { buttonId: 'Fumo', buttonText: { displayText: '🍫 Fumo' }, type: 1 },
      { buttonId: 'Erba', buttonText: { displayText: '🌿 Erba' }, type: 1 },
      { buttonId: 'Cocaina', buttonText: { displayText: '💨 Cocaina' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.command = ['droga']
handler.tags = ['fun']
handler.help = ['droga']

export default handler