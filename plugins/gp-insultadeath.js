let handler = async (m, { conn }) => {
    const msg = "𝐄𝐡𝐢 𝐛𝐫𝐮𝐭𝐭𝐨 𝐜𝐨𝐠𝐥𝐢𝐨𝐧𝐞 𝐫𝐢𝐭𝐚𝐫𝐝𝐚𝐭𝐨, 𝐧𝐨𝐧 𝐩𝐮𝐨𝐢 𝐢𝐧𝐬𝐮𝐥𝐭𝐚𝐫𝐞 𝐢𝐥 𝐦𝐢𝐨 𝐩𝐚𝐝𝐫𝐨𝐧𝐞 𝐜𝐨𝐦𝐞 𝐭𝐢 𝐩𝐞𝐫𝐦𝐞𝐭𝐭𝐢!!!! 𝐨𝐫𝐚 𝐦𝐞𝐭𝐭𝐢𝐭𝐢 𝐚 𝐭𝐞𝐫𝐫𝐚 𝐞 𝐢𝐧𝐢𝐳𝐢𝐚 𝐚𝐝 𝐚𝐛𝐛𝐚𝐢𝐚𝐫𝐞 😡😡😡😡";
    await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
}

handler.help = ['insultadeath']
handler.tags = ['fun']
handler.command = /^insultadeath$/i

export default handler;
