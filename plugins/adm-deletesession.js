// Plugin fatto da Axtral_WiZaRd 
import { existsSync, promises as fsPromises } from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {

  // 🔥 DEBUG: se vedi questo, il plugin FUNZIONA
  await conn.sendMessage(m.chat, { text: "🧪 Plugin DS avviato" }, { quoted: m })

  try {
    const sessionFolder = "./sessioni/"

    if (!existsSync(sessionFolder)) {
      return await conn.sendMessage(
        m.chat,
        { text: "❌ Cartella sessioni non trovata" },
        { quoted: m }
      )
    }

    const files = await fsPromises.readdir(sessionFolder)
    let deleted = 0

    for (const file of files) {
      if (file !== "creds.json") {
        await fsPromises.unlink(path.join(sessionFolder, file))
        deleted++
      }
    }

    const text = deleted === 0
      ? "❗ Nessuna sessione da eliminare"
      : `🔥 Eliminate ${deleted} sessioni`

    // ✅ LIST MESSAGE (FUNZIONANTE)
    await conn.sendMessage(
      m.chat,
      {
        text,
        footer: "𝔻𝕋ℍ-𝔹𝕆𝕋",
        title: "🗂️ Gestione Sessioni",
        buttonText: "Scegli azione",
        sections: [
          {
            title: "Comandi",
            rows: [
              { title: "🔄 Svuota di nuovo", rowId: ".ds" },
              { title: "📊 Ping", rowId: ".ping" }
            ]
          }
        ]
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    await conn.sendMessage(
      m.chat,
      { text: "❌ Errore durante l’operazione" },
      { quoted: m }
    )
  }
}

handler.help = ['ds']
handler.tags = ['owner']
handler.command = ['ds', 'deletesession', 'svuotasessioni']

export default handler
