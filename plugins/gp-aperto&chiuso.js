let handler = async (m, { conn, command }) => {
    let isOpen = command === 'aperto'
    await conn.groupSettingUpdate(m.chat, isOpen ? 'not_announcement' : 'announcement')
    await conn.sendMessage(m.chat, {
        text: isOpen ? '𝐏𝐚𝐫𝐥𝐚𝐭𝐞 𝐩𝐥𝐞𝐛𝐞𝐢' : '𝐎𝐫𝐚 𝐩𝐚𝐫𝐥𝐚𝐧𝐨 𝐠𝐥𝐢 𝐃𝐞𝐢',
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: global.db.data.nomedelbot || `𝔻𝕋ℍ-𝔹𝕆𝕋`
            }
        }
    }, { quoted: m })
}

handler.help = ['aperto', 'chiuso']
handler.tags = ['group']
handler.command = /^(aperto|chiuso)$/i
handler.admin = true
handler.botAdmin = true

export default handler
