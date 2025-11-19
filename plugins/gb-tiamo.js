// Plugin tiamo / ti amo
let handler = async (m, { conn }) => {
  let msg = `Puoi amare tutti tranne Blood, lui appartiene a Velith... sparisci 😈`
  await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.help = ['tiamo', 'ti amo']
handler.tags = ['fun']

// Attiva con: "tiamo" oppure "ti amo"
handler.command = /^(tiamo|ti amo)$/i

export default handler
