// Plugin fatto da Axtral_WiZaRd e modificato da dieh!
// SOLO ADMIN

import { existsSync, promises as fsPromises } from 'fs'
import path from 'path'

const handler = async (message, { conn, isAdmin, isGroup }) => {

  // 🔐 SOLO ADMIN E SOLO NEI GRUPPI
  if (!isGroup) {
    return message.reply('❌ *Questo comando può essere usato solo nei gruppi*')
  }

  if (!isAdmin) {
    return message.reply('❌ *Questo comando è riservato agli admin del gruppo*')
  }

  try {
    const sessionFolder = './sessioni/'

    if (!existsSync(sessionFolder)) {
      return conn.sendMessage(
        message.chat,
        { text: '❗ *Non c’erano sessioni da eliminare.*' },
        { quoted: message }
      )
    }

    const files = await fsPromises.readdir(sessionFolder)
    let deleted = 0

    for (const file of files) {
      if (file !== 'creds.json') {
        await fsPromises.unlink(path.join(sessionFolder, file))
        deleted++
      }
    }

    await conn.sendMessage(
      message.chat,
      {
        text:
          deleted === 0
            ? '❗ *Non c’erano sessioni da eliminare.*'
            : `🔥 *Eliminati ${deleted} file di sessione!*`
      },
      { quoted: message }
    )

  } catch (e) {
    console.error(e)
    message.reply('❌ *Errore durante l’eliminazione delle sessioni*')
  }
}

handler.help = ['ds']
handler.tags = ['admin']
handler.command = ['ds', 'deletesession', 'svuotasessioni']
handler.group = true
handler.admin = true

export default handler