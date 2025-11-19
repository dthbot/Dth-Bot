// plugin-promuovi.js

let handler = async (m, { conn, args }) => {
    if (!m.isGroup) throw '❌ Questo comando funziona solo nei gruppi.'
    if (!m.isAdmin) throw '❌ Solo gli admin possono usare questo comando.'
    if (!m.mentionedJid[0]) throw '📌 Tagga la persona da promuovere.'

    let user = m.mentionedJid[0]

    await conn.groupParticipantsUpdate(m.chat, [user], 'promote')

    let msg = `@${m.sender.split('@')[0]} 𝐇𝐚 𝐝𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 @${user.split('@')[0]}`

    await conn.sendMessage(m.chat, { text: msg, mentions: [m.sender, user] }, { quoted: m })
}

handler.command = /^(promuovi|p)$/i
export default handler
