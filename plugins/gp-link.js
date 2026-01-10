const handler = async (m, { conn }) => {
  const metadata = await conn.groupMetadata(m.chat)
  const inviteCode = await conn.groupInviteCode(m.chat)

  // Foto profilo dell'utente
  let pp
  try {
    pp = await conn.profilePictureUrl(m.sender, 'image')
  } catch {
    pp = 'https://i.ibb.co/3Fh9V6p/avatar.png' // fallback
  }

  const text = `
╭─〔 🔗 *LINK DEL GRUPPO* 🔗 〕─╮
│
│ 🏷 *Nome:* ${metadata.subject}
│
│ 🌐 *Link d’invito:*
│ https://chat.whatsapp.com/${inviteCode}
│
╰────────────────────╯
`

  await conn.sendMessage(m.chat, {
    text,
    footer: 'Link del gruppo generato dal bot 🤖',
    contextInfo: {
      externalAdReply: {
        title: 'Link del gruppo',
        body: metadata.subject,
        thumbnailUrl: pp,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: false
      }
    }
  }, { quoted: m })
}

handler.help = ['linkgroup']
handler.tags = ['group']
handler.command = /^link(gro?up)?$/i
handler.group = true
handler.botAdmin = true

export default handler