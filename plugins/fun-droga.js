// intercetta i bottoni e le liste
export async function before(m, { conn }) {
  // recupera l'ID del bottone o della riga selezionata
  const btnId =
    m.message?.buttonsResponseMessage?.selectedButtonId ||
    m.message?.templateButtonReplyMessage?.selectedId ||
    m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.msg?.selectedButtonId   // fallback per alcune versioni di Baileys

  if (!btnId) return true   // nessun bottone, passa al prossimo handler

  // se è uno dei bottoni del comando .droga
  const droghe = ['Oppio', 'Fumo', 'Erba', 'Cocaina']
  if (droghe.includes(btnId)) {
    await conn.sendMessage(m.chat, {
      text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *${btnId}*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
    }, { quoted: m })
    return true   // blocca ulteriori elaborazioni
  }

  return true
}

// comando .droga
let handler = async (m, { conn }) => {
  const buttons = [
    { buttonId: 'Oppio',   buttonText: { displayText: '⚗️ Oppio'   }, type: 1 },
    { buttonId: 'Fumo',    buttonText: { displayText: '🍫 Fumo'    }, type: 1 },
    { buttonId: 'Erba',    buttonText: { displayText: '🌿 Erba'    }, type: 1 },
    { buttonId: 'Cocaina', buttonText: { displayText: '💨 Cocaina' }, type: 1 }
  ]

  await conn.sendMessage(m.chat, {
    text: `🤔 *Che droga vuoi prendere?*`,
    footer: 'Seleziona una sostanza',
    buttons: buttons,
    headerType: 1
  }, { quoted: m })
}

handler.command = ['droga']
handler.tags    = ['fun']
handler.help    = ['droga']

export default handler
