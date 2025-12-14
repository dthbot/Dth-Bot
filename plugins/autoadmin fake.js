import { performance } from 'perf_hooks'

let handler = async (m, { conn, usedPrefix }) => {
  let nomeDelBot = global.db.data.nomedelbot || `𝔻𝕋ℍ-𝔹𝕆𝕋`
  
  const messageOptions = {
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '',
        serverMessageId: '',
        newsletterName: `${nomeDelBot}`
      }
    }
  }

  await conn.sendMessage(m.chat, {
    text: `𝐑𝐈𝐊𝐊𝐈𝐎𝐍𝐄, 𝐧𝐨𝐧 𝐬𝐞𝐢 𝐧𝐞𝐬𝐬𝐮𝐧𝐨 𝐞 𝐯𝐮𝐨𝐢 𝐝𝐢𝐯𝐞𝐧𝐭𝐚𝐫𝐞 𝐚𝐝𝐦𝐢𝐧 𝐧𝐞𝐥 𝐧𝐨𝐬𝐭𝐫𝐨 𝐠𝐫𝐮𝐩𝐩𝐨 𝐛𝐞𝐥𝐥𝐢𝐬𝐬𝐢𝐦𝐨? 😂`,
    ...messageOptions
  })
}

handler.help = ['autoadmin']
handler.tags = ['fun']
handler.command = /^(autoadmin)$/i

export default handler
