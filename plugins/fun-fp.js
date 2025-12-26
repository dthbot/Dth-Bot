let handler = async (m, { conn, args }) => {
    if (!args[0]) throw '❌ Inserisci il numero! Esempio: .fp 393491234567'

    let number = args[0].replace(/[^0-9]/g, '') // pulisce il numero
    if (!number.endsWith('@s.whatsapp.net')) number = number + '@s.whatsapp.net'

    try {
        const url = await conn.profilePictureUrl(number, 'image')
        await conn.sendMessage(m.chat, { 
            image: { url }, 
            caption: `🖼 Foto profilo di *${args[0]}*`
        }, { quoted: m })
    } catch (e) {
        m.reply('❌ Non è stato possibile recuperare la foto profilo.\nForse l\'utente non ha immagine o non esiste.')
    }
}

handler.help = ['fp']
handler.tags = ['tools']
handler.command = ['fp']
export default handler