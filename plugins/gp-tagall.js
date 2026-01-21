// ✦ Plugin fatto da Deadly

let handler = async (m, { isOwner, isAdmin, conn, participants, args }) => {
    if (!(isAdmin || isOwner)) return

    let nomebot = conn.user.name || '𝐁𝐎𝐓'
    let message = args.join(' ') || '𝑁𝑒𝑠𝑠𝑢𝑛 𝑚𝑒𝑠𝑠𝑎𝑔𝑔𝑖𝑜'

    let text = `
╔════════════╗
      🔔 𝐓𝐀𝐆 𝐀𝐋𝐋 🔔
╚════════════╝

🤖 𝐁𝐨𝐭: ${nomebot}
🗣️ 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢𝐨:
➤ ${message}

━━━━━━━━━━━━━━━━━━━
👥 𝐌𝐄𝐌𝐁𝐑𝐈 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐏𝐎
━━━━━━━━━━━━━━━━━━━
`

    for (let user of participants) {
        text += `✦ @${user.id.split('@')[0]}\n`
    }

    text += `
━━━━━━━━━━━━━━━━━━━
✨ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐞𝐬𝐞𝐠𝐮𝐢𝐭𝐨 𝐜𝐨𝐧 𝐬𝐭𝐢𝐥𝐞 ✨
`

    // Foto profilo dell’utente (thumbnail piccola)
    let pp
    try {
        pp = await conn.profilePictureUrl(m.sender, 'image')
    } catch {
        pp = 'https://i.ibb.co/rF7S0Yk/avatar-contact.png'
    }

    await conn.sendMessage(
        m.chat,
        {
            text,
            mentions: participants.map(p => p.id),
            contextInfo: {
                externalAdReply: {
                    title: '🔔 TAG ALL',
                    body: 'Invocazione membri del gruppo',
                    thumbnailUrl: pp,
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    showAdAttribution: false
                }
            }
        },
        { quoted: m }
    )
}

handler.command = /^(tagall|invocar|marcar|todos)$/i
handler.group = true
handler.admin = true

export default handler