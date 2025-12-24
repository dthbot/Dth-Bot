// intercetta la risposta testuale
export async function before(m, { conn }) {
  if (!m.text || !m.quoted || !m.quoted.text) return true

  // Verifica se l'utente sta rispondendo al messaggio del catalogo droga
  if (!m.quoted.text.includes('🏪 DROGA SHOP')) return true

  const scelta = m.text.toLowerCase().trim()
  let prodotto = ''

  if (scelta === '1') prodotto = 'Oppio'
  if (scelta === '2') prodotto = 'Fumo'
  if (scelta === '3') prodotto = 'Erba'
  if (scelta === '4') prodotto = 'Cocaina'

  if (prodotto) {
    await conn.sendMessage(m.chat, {
      text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *${prodotto}*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
    }, { quoted: m })
  }

  return true
}

// comando .droga
let handler = async (m, { conn }) => {
  const menu = `🏪 *DROGA SHOP* 🏪\n
🤔 *Che droga vuoi prendere?*
_Rispondi a questo messaggio con il numero corrispondente:_

1. ⚗️ *Oppio*
2. 🍫 *Fumo*
3. 🌿 *Erba*
4. 💨 *Cocaina*

💪 _Scegli bene!_`

  await conn.sendMessage(m.chat, { text: menu }, { quoted: m })
}

handler.command = ['droga']
handler.tags = ['fun']
handler.help = ['droga']

export default handler
