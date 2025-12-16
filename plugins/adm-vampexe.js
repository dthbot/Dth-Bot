import fs from 'fs'

let handler = async (m, { conn }) => {
  if (!m.text) return

  if (m.text.toLowerCase().includes('vampexe')) {
    const sticker = fs.readFileSync('./media/vampexe.webp')

    await conn.sendMessage(
      m.chat,
      { sticker },
      { quoted: m }
    )
  }
}

handler.all = true

export default handler
