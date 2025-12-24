import axios from "axios"

export default {
  command: ['ttsc'],
  tags: ['downloader'],
  help: ['ttsc <link tiktok>'],
  
  async run(m, { conn, args }) {
    if (!args[0]) {
      return m.reply('❌ Inserisci un link TikTok\n\nEsempio:\n.ttsc https://www.tiktok.com/...')
    }

    const url = args[0]
    if (!url.includes('tiktok.com')) {
      return m.reply('❌ Link non valido')
    }

    try {
      m.reply('⏳ Scaricando il video...')

      // API pubblica (semplice e veloce)
      const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}`
      const res = await axios.get(api)

      if (!res.data || !res.data.data) {
        return m.reply('❌ Errore nel download')
      }

      const videoUrl = res.data.data.play

      await conn.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption: '✅ Video TikTok scaricato'
        },
        { quoted: m }
      )

    } catch (err) {
      console.error(err)
      m.reply('❌ Errore durante il download del video')
    }
  }
}