// Plugin .tiamo
let handler = async (m, { conn, command }) => {
  let msg = `Puoi amare tutti tranne Blood, lui appartiene a Velith... sparisci 😈`
  await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.help = ['tiamo']
handler.tags = ['fun']
handler.command = /^tiamo$/i
export default handler
