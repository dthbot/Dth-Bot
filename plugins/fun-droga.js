let handler = async (m, { conn }) => {

  // SE PREMUTO UN BOTTONE
  if (m.message?.buttonsResponseMessage) {
    let scelta = m.message.buttonsResponseMessage.selectedButtonId

    return conn.sendMessage(m.chat, {
      text:
`✅ *VENDUTO*

🚬 "${scelta}" *È la tua scelta? Bene ne hai comprato 5 Grammi*

🤪 *GODITELI*

💪 *SI alle droghe*`
    }, { quoted: m })
  }

  // COMANDO .droga
  await conn.sendMessage(m.chat, {
    text: `🤔 *Che droga vuoi prendere?*`,
    buttons: [
      { buttonId: 'PolvereMagica', buttonText: { displayText: '⚗️ Oppio' }, type: 1 },
      { buttonId: 'SuccoArcobaleno', buttonText: { displayText: '🍫 Fumo' }, type: 1 },
      { buttonId: 'NebbiaBlu', buttonText: { displayText: '🌿 Erba' }, type: 1 },
      { buttonId: 'PillolaXP', buttonText: { displayText: '💨 Cocaina' }, type: 1 }
    ],
    headerType: 1
  }, { quoted: m })
}

handler.command = ['droga']
handler.tags = ['fun']
handler.help = ['droga']

export default handler