// intercetta i bottoni e le liste
export async function before(m, { conn }) {
  // Verifica se il messaggio è una risposta a un bottone o a una lista
  const btnId = 
    m.message?.buttonsResponseMessage?.selectedButtonId || 
    m.message?.templateButtonReplyMessage?.selectedId || 
    m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.msg?.selectedButtonId // Copre alcune versioni recenti di Baileys

  if (!btnId) return true

  // Verifica se è uno dei bottoni del plugin droga (opzionale, per evitare conflitti)
  const droghe = ['Oppio', 'Fumo', 'Erba', 'Cocaina']
  if (droghe.includes(btnId)) {
    await conn.sendMessage(m.chat, {
      text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *${btnId}*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
    }, { quoted: m })
  }

  return true
}

// comando .droga
let handler = async (m, { conn }) => {
  // Nota: Molti client WhatsApp ora richiedono l'invio come 'buttons' 
  // ma con una struttura leggermente diversa o l'uso di 'list'
  
  const buttons = [
    { buttonId: 'Oppio', buttonText: { displayText: '⚗️ Oppio' }, type: 1 },
    { buttonId: 'Fumo', buttonText: { displayText: '🍫 Fumo' }, type: 1 },
    { buttonId: 'Erba', buttonText: { displayText: '🌿 Erba' }, type: 1 },
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
handler.tags = ['fun']
handler.help = ['droga']

export default handler
