// Plugin fatto da Axtral_WiZaRd e modificato da dieh!

import { existsSync, promises as fsPromises } from 'fs'
import path from 'path'

const handler = async (message, { conn, isOwner, isAdmin }) => {

  // 🔐 SOLO OWNER O ADMIN
  if (!isOwner && !isAdmin) {
    return message.reply(
      '❌ *Questo comando è riservato agli admin o all’owner del bot*'
    )
  }

  // ⚠️ Deve essere usato in privato col bot
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(
      message.chat,
      {
        text: "*🚨 𝐔𝐭𝐢𝐥𝐢𝐳𝐳𝐚 𝐪𝐮𝐞𝐬𝐭𝐨 𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐝𝐢𝐫𝐞𝐭𝐭𝐚𝐦𝐞𝐧𝐭𝐞 𝐧𝐞𝐥 𝐧𝐮𝐦𝐞𝐫𝐨 𝐝𝐞𝐥 𝐛𝐨𝐭.*"
      },
      { quoted: message }
    )
  }

  try {
    const sessionFolder = './sessioni/'

    if (!existsSync(sessionFolder)) {
      return await conn.sendMessage(
        message.chat,
        {
          text: '❗ *Non c’erano sessioni da eliminare.*',
          buttons: [
            { buttonId: '.ping', buttonText: { displayText: '⏳ 𝐏𝐢𝐧𝐠' }, type: 1 },
            { buttonId: '.ds', buttonText: { displayText: '🗑️ 𝐑𝐢𝐟𝐚𝐢 𝐃𝐒' }, type: 1 }
          ],
          headerType: 1
        },
        { quoted: message }
      )
    }

    const sessionFiles = await fsPromises.readdir(sessionFolder)
    let deletedCount = 0

    for (const file of sessionFiles) {
      if (file !== 'creds.json') {
        await fsPromises.unlink(path.join(sessionFolder, file))
        deletedCount++
      }
    }

    const responseText =
      deletedCount === 0
        ? '❗ *Non c’erano sessioni da eliminare.*'
        : `🔥 *Sono stati eliminati ${deletedCount} archivi dalle sessioni!*`

    await conn.sendMessage(
      message.chat,
      {
        text: responseText,
        buttons: [
          { buttonId: '.ping', buttonText: { displayText: '⏳ 𝐏𝐢𝐧𝐠' }, type: 1 },
          { buttonId: '.ds', buttonText: { displayText: '🗑️ 𝐑𝐢𝐟𝐚𝐢 𝐃𝐒' }, type: 1 }
        ],
        headerType: 1
      },
      { quoted: message }
    )

  } catch (error) {
    console.error('Errore:', error)
    await conn.sendMessage(
      message.chat,
      {
        text: '❌ *Errore durante l’eliminazione delle sessioni!*',
        buttons: [
          { buttonId: '.ping', buttonText: { displayText: '⏳ 𝐏𝐢𝐧𝐠' }, type: 1 },
          { buttonId: '.ds', buttonText: { displayText: '🗑️ 𝐑𝐢𝐟𝐚𝐢 𝐃𝐒' }, type: 1 }
        ],
        headerType: 1
      },
      { quoted: message }
    )
  }
}

handler.help = ['del_reg_in_session_owner']
handler.tags = ['owner', 'admin']
handler.command = ['ds', 'deletesession', 'svuotasessioni']

export default handler