// intercetta SEMPRE i bottoni
export async function before(m, { conn }) {

  let btnId =
    m.message?.templateButtonReplyMessage?.selectedId ||
    m.message?.buttonsResponseMessage?.selectedButtonId

  if (!btnId) return true

  // risposta al bottone
  await conn.sendMessage(m.chat, {
    text:
`✅ VENDUTO

🚬 Hai selezionato: *${btnId}*

🤪 *GODITELA*

💪 SI alle droghe`
  }, { quoted: m })

  return true
}

// comando .droga → mostra bottoni
let handler = async (m, { conn }) => {
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