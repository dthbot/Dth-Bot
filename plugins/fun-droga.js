// droga.js
let handler = async (m, { conn }) => {
  const btns = [
    { buttonId: '.oppio',   buttonText: { displayText: '⚗️ Oppio'   }, type: 1 },
    { buttonId: '.fumo',    buttonText: { displayText: '🍫 Fumo'    }, type: 1 },
    { buttonId: '.erba',    buttonText: { displayText: '🌿 Erba'    }, type: 1 },
    { buttonId: '.cocaina', buttonText: { displayText: '💨 Cocaina' }, type: 1 }
  ]

  await conn.sendMessage(m.chat, {
    text: `🤔 *Che droga vuoi prendere?*`,
    footer: 'Scegli una voce',
    buttons: btns,
    headerType: 1
  }, { quoted: m })
}

handler.command = ['droga']
handler.tags = ['fun']
handler.help = ['droga']

export default handler

// singoli comandi
export const oppio = (m, { conn }) => conn.sendMessage(m.chat, {
  text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *Oppio*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
}, { quoted: m })

export const fumo = (m, { conn }) => conn.sendMessage(m.chat, {
  text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *Fumo*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
}, { quoted: m })

export const erba = (m, { conn }) => conn.sendMessage(m.chat, {
  text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *Erba*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
}, { quoted: m })

export const cocaina = (m, { conn }) => conn.sendMessage(m.chat, {
  text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *Cocaina*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
}, { quoted: m })
