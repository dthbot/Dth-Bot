import fs from 'fs'

let handler = async (m, { conn }) => {
  const stickerPath = './media/vampexe.webp'
  if (!fs.existsSync(stickerPath)) {
    return m.reply("⚠️ Il file media/vampexe.webp non esiste!")
  }
  // Usiamo sendMessage con tipo sticker e opzioni aggiuntive
  await conn.sendMessage(m.chat, {
    sticker: {
      url: stickerPath
    },
    packname: 'Vampexe💎',
    author: '𝕯𝖊ⱥ𝖉𝖑𝐲'
  }, {
    quoted: m
  })
}

handler.customPrefix = /vamp/i
handler.command = new RegExp
export default handler
