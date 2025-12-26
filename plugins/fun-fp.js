let handler = async (m, { conn, args }) => {
    if (!args[0]) throw '❌ Inserisci il numero! Esempio: .fp 393491234567'

    // Pulisce il numero: rimuove +, -, spazi e caratteri non numerici
    let number = args[0].replace(/[^0-9]/g, '')

    // Aggiunge il suffisso WhatsApp se manca
    if (!number.endsWith('@s.whatsapp.net')) number = number + '@s.whatsapp.net'

    try {
        const url = await conn.profilePictureUrl(number, 'image')
        await conn.sendMessage(m.chat, { 
            image: { url }, 
            caption: `🖼 Foto profilo di *${args[0]}*`
        }, { quoted: m })
    } catch (e) {
        // URL di default valido
        const defaultImg = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        await conn.sendMessage(m.chat, { 
            image: { url: defaultImg }, 
            caption: `❌ Non è stato possibile recuperare la foto profilo di *${args[0]}*.\nMostro immagine di default.` 
        }, { quoted: m })
    }
}

handler.help = ['fp']
handler.tags = ['tools']
handler.command = ['fp']
export default handler