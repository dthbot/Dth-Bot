// Plugin fatto da death 
let handler = async (m, { conn }) => {

    let msg = `*Una cosa facsa 😳 te mi uccideresti veramente per un fottuto voip?!?!? per un fottutissimo voip?!?!?😭😭😭*`

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.help = ['foxa']
handler.tags = ['fun']
handler.command = /^foxa$/i

export default handler
