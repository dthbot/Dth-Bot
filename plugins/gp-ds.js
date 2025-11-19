let handler = async (m, { conn }) => {

    // Numero casuale tra 156 e 2578
    let random = Math.floor(Math.random() * (2578 - 156 + 1)) + 156;

    let msg = `🗑️ 𝐇𝐨 𝐞𝐥𝐢𝐦𝐢𝐧𝐚𝐭𝐨 ${random} 𝐚𝐫𝐜𝐡𝐢𝐯𝐢 𝐝𝐞𝐥𝐥𝐚 𝐬𝐞𝐬𝐬𝐢𝐨𝐧𝐞!  
𝐆𝐫𝐚𝐳𝐢𝐞 𝐩𝐞𝐫 𝐚𝐯𝐞𝐫𝐦𝐢 𝐬𝐯𝐮𝐨𝐭𝐚𝐭𝐨 𝐥𝐞 𝐩𝐚𝐥𝐥𝐞 ❤️`;

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
};

handler.command = /^ds$/i;
export default handler;
