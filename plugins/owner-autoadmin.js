let handler = async (m, { conn, isAdmin }) => {  
if (m.fromMe) return
if (isAdmin) throw '𝐬𝐞𝐢 𝐠𝐢𝐚 𝐚𝐝𝐦𝐢𝐧 𝐟𝐫𝐨𝐜𝐢𝐨'
try {  
await conn.groupParticipantsUpdate(m.chat, [m.sender], "promote")
} catch {
await m.reply('non ti è concesso')}}
handler.command = /^goodboy|𝛬𝑿𝑻𝑹𝜜𝑳|𝕯𝖊ⱥ𝖙𝖍$/i
handler.rowner = true
handler.group = true
handler.botAdmin = true
export default handler
