// Plugin fatto da Axtral_WiZaRd e modificato da dieh! (fix bottoni)
import { existsSync, promises as fsPromises } from 'fs'
import path from 'path'

const handler = async (message, { conn }) => {

  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(
      message.chat,
      { text: "*🚨 Usa questo comando SOLO nel numero del bot.*" },
      { quoted: message }
    )
  }

  try {
    const sessionFolder = "./sessioni/"

    if (!existsSync(sessionFolder)) {
      return await conn.sendMessage(
        message.chat,
        { text: "*❌ Cartella sessioni vuota o inesistente.*" },
        { quoted: message }
      )
    }

    const sessionFiles = await fsPromises.readdir(sessionFolder)
    let deletedCount = 0

    for (const file of sessionFiles) {
      if (file !== "creds.json") {
        await fsPromises.unlink(path.join(sessionFolder, file))
        deletedCount++
      }
    }

    const responseText = deletedCount === 0
      ? "❗ Le sessioni sono già vuote"
      : `🔥 Eliminati *${deletedCount}* file dalle sessioni`

    // ✅ LIST MESSAGE (al posto dei bottoni rotti)
    const listMessage = {
      text: responseText,
      footer: "𝔻𝕋ℍ-𝔹𝕆𝕋 • Session Manager",
      title: "🗂️ Gestione Sessioni",
      buttonText: "📌 Scegli azione",
      sections: [
        {
          title: "⚙️ Comandi disponibili",
          rows: [
            {
              title: "🔄 Svuota di nuovo",
              description: "Ripeti la pulizia sessioni",
              rowId: ".ds"
            },
            {
              title: "📊 Ping",
              description: "Controlla lo stato del bot",
              rowId: ".ping"
            },
            {
              title: "⚡ Pong",
              description: "Test risposta rapida",
              rowId: ".pong"
            }
          ]
        }
      ]
    }

    await conn.sendMessage(message.chat, listMessage, { quoted: message })

  } catch (error) {
    console.error("Errore:", error)
    await conn.sendMessage(
      message.chat,
      { text: "❌ Errore durante l'eliminazione delle sessioni" },
      { quoted: message }
    )
  }
}

handler.help = ['ds', 'deletesession', 'svuotasessioni']
handler.tags = ['owner']
handler.command = ['ds', 'deletesession', 'svuotasessioni']
handler.admin = true

export default handler
