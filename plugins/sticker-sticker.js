import { sticker } from '../lib/sticker.js'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, args }) => {
    let stiker = false
    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''

        if (/webp|image|video/.test(mime)) {
            if (/video/.test(mime)) {
                if ((q.msg || q).seconds > 9)
                    return m.reply("⚠️ Il video deve essere meno di 10 secondi")
            }

            m.reply('ⓘ 𝐂𝐚𝐫𝐢𝐜𝐚𝐦𝐞𝐧𝐭𝐨 ...')

            let img = await q.download?.()
            if (!img) return m.reply("❌ Non riesco a scaricare il file.")

            try {
                stiker = await sticker(img, false, global.packname, global.author)
            } catch (e) {
                console.log("Sticker conversione diretta fallita:", e)
            }

            if (!stiker) {
                let out

                if (/webp/.test(mime)) out = await webp2png(img)
                else if (/image/.test(mime)) out = await uploadImage(img)
                else if (/video/.test(mime)) out = await uploadFile(img)

                if (typeof out !== "string") out = await uploadImage(img)

                stiker = await sticker(false, out, global.packname, global.author)
            }

        } else if (args[0]) {
            if (isUrl(args[0])) {
                stiker = await sticker(false, args[0], global.packname, global.author)
            } else {
                return m.reply("❌ URL non valido.")
            }
        }

    } catch (e) {
        console.error("Sticker ERROR:", e)
        return m.reply("❌ Errore nella creazione dello sticker.")
    }

    if (stiker) {
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, null, {
            asSticker: true
        })
    } else {
        return m.reply("❌ Errore, nessuno sticker generato.")
    }
}

handler.help = ['s', 'sticker']
handler.tags = ['sticker']
handler.command = /^s(tic?ker)?(gif)?$/i

export default handler

const isUrl = (text) => {
    return /https?:\/\/.*\.(jpe?g|gif|png|webp)/i.test(text)
}
