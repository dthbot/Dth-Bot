// intercetta la selezione dalla lista
export async function before(m, { conn }) {
  // Cattura l'ID sia dai bottoni che dalle liste
  let selectedId = 
    m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.message?.buttonsResponseMessage?.selectedButtonId ||
    m.message?.templateButtonReplyMessage?.selectedId

  if (!selectedId) return true

  const droghe = ['Oppio', 'Fumo', 'Erba', 'Cocaina']
  
  if (droghe.includes(selectedId)) {
    await conn.sendMessage(m.chat, {
      text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *${selectedId}*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
    }, { quoted: m })
  }

  return true
}

// comando .droga
let handler = async (m, { conn }) => {
  const sections = [
    {
      title: "Sostanze Disponibili",
      rows: [
        { title: "⚗️ Oppio", rowId: "Oppio", description: "Qualità extra" },
        { title: "🍫 Fumo", rowId: "Fumo", description: "Direttamente dal Marocco" },
        { title: "🌿 Erba", rowId: "Erba", description: "Naturale 100%" },
        { title: "💨 Cocaina", rowId: "Cocaina", description: "Pura al 99%" }
      ]
    }
  ]

  const listMessage = {
    text: "🤔 *Che droga vuoi prendere?*",
    footer: "Clicca il bottone qui sotto",
    title: "🏪 DROGA SHOP",
    buttonText: "Scegli la sostanza",
    sections
  }

  await conn.sendMessage(m.chat, listMessage, { quoted: m })
}

handler.command = ['droga']
handler.tags = ['fun']
handler.help = ['droga']

export default handler
