let handler = async (m, { conn, text, participants }) => {
    let utentiMenzionati = m.mentionedJid;
    
    if (!utentiMenzionati.length) {
        return m.reply("😏 *Devi menzionare qualcuno per farti fare un pompino!* \nEsempio: _.pompino @utente_");
    }

    let utenteScelto = utentiMenzionati[0];

    let messaggio = `💋 *${await conn.getName(m.sender)} 𝐬𝐢 è 𝐟𝐚𝐭𝐭𝐨 𝐟𝐚𝐫𝐞 𝐮𝐧 𝐩𝐨𝐦𝐩𝐢𝐧𝐨 𝐝𝐚 @${utenteScelto.split("@")[0]}!* 🔥\n\n😏 𝐒𝐩𝐞𝐫𝐢𝐚𝐦𝐨 𝐜𝐡𝐞 𝐬𝐢𝐚 𝐬𝐭𝐚𝐭𝐨 𝐝𝐢 𝐭𝐮𝐨 𝐠𝐫𝐚𝐝𝐢𝐦𝐞𝐧𝐭𝐨...`;

    await conn.sendMessage(m.chat, { text: messaggio, mentions: [utenteScelto] }, { quoted: m });
};

// Definizione del comando per Gab
handler.command = ["pompino"];
export default handler;
