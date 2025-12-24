// droga.js
export async function before(m, { conn }) {
  const btnId =
    m.message?.buttonsResponseMessage?.selectedButtonId ||
    m.message?.templateButtonReplyMessage?.selectedId ||
    m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.msg?.selectedButtonId

  if (!btnId) return true

  const droghe = ['Oppio', 'Fumo', 'Erba', 'Cocaina']
  if (droghe.includes(btnId)) {
    await conn.sendMessage(m.chat, {
      text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *${btnId}*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
    }, { quoted: m })
    return true
  }

  return true
}

let handler = async (m, { conn }) => {
  const buttons = [
    { buttonId: 'Oppio',   buttonText: { displayText: '⚗️ Oppio'   }, type: 1 },
    { buttonId: 'Fumo',    buttonText: { displayText: '🍫 Fumo'    }, type: 1 },
    { buttonId: 'Erba',    buttonText: { displayText: '🌿 Erba'    }, type: 1 },
    { buttonId: 'Cocaina', buttonText: { displayText: '💨 Cocaina' }, type: 1 }
  ]

  await conn.sendMessage(m.chat, {
    text: `🤔 *Che droga vuoi prendere?*`,
    footer: 'Scegli una voce',
    buttons,
    headerType: 1
  }, { quoted: m })
}

// singoli comandi .oppio .fumo .erba .cocaina
const single = (drug) => async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *${drug}*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
  }, { quoted: m })
}

handler.command = ['droga']
handler.tags = ['fun']
handler.help = ['droga']

export default handler

export const oppio = single('Oppio')
export const fumo = single('Fumo')
export const erba = single('Erba')
export const cocaina = single('Cocaina')
