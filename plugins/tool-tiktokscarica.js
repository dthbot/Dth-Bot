import fetch from 'node-fetch'

export default {
  command: ['ttsc'],
  tags: ['downloader'],
  help: ['ttsc <link tiktok>'],

  async run(m, { conn, args }) {
    if (!args[0]) return m.reply('❌ Inserisci un link TikTok')

    const url = args[0]
    if (!url.includes('tiktok.com')) return m.reply('❌ Link TikTok non valido')

    try {
      await m.reply('⏳ Attendi, scarico il video...')

      const res = await fetch(
        `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`
      )
      const json = await res.json()

      if (!json.video || !json.video.noWatermark) {
        return m.reply('❌ Download fallito')
      }

      await conn.sendMessage(
        m.chat,
        {
          video: { url: json.video.noWatermark },
          caption: '✅ TikTok scaricato'
        },
        { quoted: m }
      )

    } catch (e) {
      console.log(e)
      m.reply('❌ Errore durante il download')
    }
  }
}