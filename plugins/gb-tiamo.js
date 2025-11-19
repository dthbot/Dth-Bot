// Plugin tiamo / ti amo senza prefisso
let handler = async (m, { conn }) => {
  let msg = `Puoi amare tutti tranne Blood, lui appartiene a Velith... sparisci 😈`
  await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.help = ['tiamo', 'ti amo']
handler.tags = ['fun']

// Nessun prefisso → usa customPrefix
handler.customPrefix = /^(tiamo|ti amo)$/i
handler.command = new RegExp // necessario per farlo triggerare senza prefisso

export default handler
