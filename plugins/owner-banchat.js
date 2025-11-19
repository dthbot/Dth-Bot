let handler = async (m) => {
global.db.data.chats[m.chat].isBanned = true
m.reply('𝐇𝐨 𝐛𝐥𝐨𝐜𝐜𝐚𝐭𝐨 𝐬𝐭𝐚 𝐦𝐞𝐫𝐝𝐚 𝐝𝐢 𝐜𝐡𝐚𝐭 ✓')
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^007$/i
handler.rowner = true
export default handler


