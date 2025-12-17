import fs from 'fs'

let handler = async (m, { conn }) => {
  const stickerPath = './media/vampexe.webp'
  if (!fs.existsSync(stickerPath)) {
    return m.reply("⚠️ Il file media/vampexe.webp non esiste!")
  }
  // Usiamo sendSticker che gestisce automaticamente la conversione e i metadati
  await conn.sendSticker(m.chat, stickerPath, m, { pack: 'Vampexe', author: '𝕯𝖊ⱥ𝖉𝖑𝐲' })
}

handler.customPrefix = /vamp/i
handler.command = new RegExp
export default handler
