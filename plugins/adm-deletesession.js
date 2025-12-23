// Plugin fatto da Axtral_WiZaRd e modificato da dieh!
// Fix permessi OWNER + ADMIN (owner bypassa admin)

import { existsSync, promises as fsPromises } from 'fs'
import path from 'path'

const handler = async (message, { conn, isOwner, isAdmin, isGroup }) => {

  // 🔐 PERMESSI
  if (!isOwner) {
    if (!isGroup || !isAdmin) {
      return message.reply(
        '❌ *Questo comando è riservato agli admin o all’owner del bot*'
      )
    }
  }

  // ⚠️ SOLO CHAT PRIVATA COL BOT
  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(
      message.chat,
      {
        text: '*🚨 Usa questo comando direttamente in privato col bot.*'
      },
      { quoted: message }
    )
  }

  try {
    const sessionFolder = './sessioni/'

    if (!existsSync(sessionFolder)) {
      return conn.sendMessage(
        message.chat,
        {
          text: '❗ *Non c’erano sessioni da eliminare.*',
          buttons: [
            { buttonId: '.ping', buttonText: { displayText: '⏳ Ping' }, type: 1 },
            { buttonId: '.ds', buttonText: { displayText: '🗑️ Rifai DS' }, type: 1 }
          ],
          headerType: 1
        },
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
            : `🔥 *Eliminati ${deleted} file di sessione con successo!*`,
        buttons: [
          { buttonId: '.ping', buttonText: { displayText: '⏳ Ping' }, type: 1 },
          { buttonId: '.ds', buttonText: { displayText: '🗑️ Rifai DS' }, type: 1 }
        ],
        headerType: 1
      },
      { quoted: message }
    )

  } catch (e) {
    console.error(e)
    message.reply('❌ *Errore durante l’eliminazione delle sessioni*')
  }
}

handler.help = ['ds']
handler.tags = ['owner', 'admin']
handler.command = ['ds', 'deletesession', 'svuotasessioni']

export default handler