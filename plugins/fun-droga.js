// droga.js
export default {
  name: 'droga',
  command: ['droga'],
  tags: ['fun'],
  help: ['droga'],
  async exec({ conn, msg }) {
    const buttons = [
      { id: 'Oppio',   text: '⚗️ Oppio' },
      { id: 'Fumo',    text: '🍫 Fumo' },
      { id: 'Erba',    text: '🌿 Erba' },
      { id: 'Cocaina', text: '💨 Cocaina' }
    ]

    await conn.sendMessage(msg.chat, {
      text: `🤔 *Che droga vuoi prendere?*`,
      footer: 'Scegli una voce',
      buttons,
      headerType: 1
    }, { quoted: msg })
  }
}

// listener che cattura i click sui bottoni
export const button = {
  async exec({ conn, msg, data }) {
    const btnId = data?.selected?.id   // ChatUnity passa l'ID del bottone così

    if (!btnId) return

    const droghe = ['Oppio', 'Fumo', 'Erba', 'Cocaina']
    if (droghe.includes(btnId)) {
      await conn.sendMessage(msg.chat, {
        text: `✅ *VENDUTO*\n\n🚬 Hai selezionato: *${btnId}*\n\n🤪 *GODITELA*\n\n💪 SI alle droghe`
      }, { quoted: msg })
    }
  }
}
