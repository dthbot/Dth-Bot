import fs from 'fs'

let handler = async (m, { conn }) => {
  if (!m.text) return

  if (m.text.toLowerCase().includes('vampexe')) {
    const buffer = fs.readFileSync('./media/vampexe.webp')

    await conn.sendMessage(
      m.chat,
      { sticker: buffer },
      { quoted: m }
    )
  }
}

// QUESTA È LA PARTE CHIAVE
handler.before = true

export default handler
