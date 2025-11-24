// Plugin .bloodban - versione sicura (nessun ban reale, solo messaggio)
let handler = async (m, { conn, participants }) => {
    let utenti = participants.map(p => p.id)
    let scelto = utenti[Math.floor(Math.random() * utenti.length)]

    let frasi = [
        "⚠️ Estratta la vittima… preparate i fazzoletti!",
        "💀 Il fato ha scelto… nessuno può sfuggirgli!",
        "🕳️ Il portale si apre… qualcuno verrà risucchiato!"
    ]
    let frase = frasi[Math.floor(Math.random() * frasi.length)]

    let testo = `${frase}\n\n🎯 **Target selezionato:** @${scelto.split('@')[0]}\n\n📌 *Motivo:* Sfortuna cosmica`

    await conn.sendMessage(m.chat, { text: testo, mentions: [scelto] }, { quoted: m })
}

handler.help = ['rsban']
handler.tags = ['fun']
handler.command = /^rsban$/i
export default handler
