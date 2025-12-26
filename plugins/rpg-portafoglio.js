import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.quoted
        ? m.quoted.sender
        : m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.fromMe
        ? conn.user.jid
        : m.sender

    if (!(who in global.db.data.users))
        throw '🚩 Utente non trovato nel database'

    let user = global.db.data.users[who]
    if (!user.limit) user.limit = 15000
    if (!user.bank) user.bank = 0

    const name = conn.getName(who)
    const userWallet = user.limit
    const userBank = user.bank
    const imgUrl = 'https://i.ibb.co/4RSNsdx9/Sponge-Bob-friendship-wallet-meme-9.png'

    const message = `
╭─「 💰 𝐏𝐎𝐑𝐓𝐀𝐅𝐎𝐆𝐋𝐈𝐎 」─
│
│ 👤 Utente: ${name}
│ 💶 Contanti: €${formatNumber(userWallet)}
│ 🏦 Bank: €${formatNumber(userBank)}
│
╰───────✦───────
    `.trim()

    await conn.sendMessage(m.chat, {
        text: message,
        mentions: [who],
        contextInfo: {
            externalAdReply: {
                title: `💼 Portafoglio di ${name}`,
                body: `Saldo: €${formatNumber(userWallet)} 💶`,
                thumbnailUrl: imgUrl,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    })

    m.react('💶')
}

handler.help = ['wallet']
handler.tags = ['economy']
handler.command = ['soldi', 'wallet', 'portafoglio', 'saldo', 'euro']
handler.register = true

export default handler

function formatNumber(num) {
    return new Intl.NumberFormat('it-IT').format(num)
}