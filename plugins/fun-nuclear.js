// Plugin unico fatto da Death

let handler = async (m, { conn, command }) => {

  // ─── 1) MESSAGGIO INIZIALE (.nuclear)
  if (command === "nuclear") {
    const testoIniziale = `𝐄𝐡𝐢 𝐬𝐜𝐞𝐦𝐨, 𝐜𝐨𝐬𝐚 𝐯𝐮𝐨𝐢 𝐝𝐚 𝐧𝐮𝐜𝐥𝐞𝐚𝐫?
𝐯𝐚𝐛𝐛è 𝐝𝐚𝐢 𝐩𝐞𝐫 𝐬𝐭𝐚 𝐯𝐨𝐥𝐭𝐚 𝐥𝐚𝐬𝐜𝐢𝐨 𝐜𝐨𝐫𝐫𝐞𝐫𝐞...
𝐜𝐥𝐢𝐜𝐜𝐚 𝐮𝐧𝐨 𝐝𝐞𝐢 𝐛𝐨𝐭𝐭𝐨𝐧𝐢 𝐞 𝐝𝐢𝐯𝐞𝐫𝐭𝐢𝐭𝐢 😘`;

    await conn.sendMessage(m.chat, {
      text: testoIniziale,
      buttons: [
        { buttonId: ".nuclearbanca", buttonText: { displayText: "🏦 𝐍𝐔𝐂𝐋𝐄𝐀𝐑 𝐁𝐀𝐍𝐂𝐀" }, type: 1 },
        { buttonId: ".nuclear", buttonText: { displayText: "🔁 𝐑𝐈𝐅𝐀𝐈 𝐍𝐔𝐂𝐋𝐄𝐀𝐑" }, type: 1 }
      ],
      headerType: 1
    }, { quoted: m });

    return;
  }

  // ─── 2) TESTO DELLA BANCA (.nuclearbanca)
  if (command === "nuclearbanca") {

    const testoBanca = `𝐍𝐮𝐜𝐥𝐞𝐚𝐫 è 𝐥𝐚 𝐛𝐚𝐧𝐜𝐚 𝐩𝐞𝐫𝐬𝐨𝐧𝐚𝐥𝐞 𝐝𝐢 𝐭𝐮𝐭𝐭𝐢, 𝐦𝐚 𝐬𝐨𝐩𝐫𝐚𝐭𝐭𝐮𝐭𝐭𝐨 𝐪𝐮𝐞𝐥𝐥𝐚 𝐝𝐢 𝐁𝐥𝐨𝐨𝐝 𝐯𝐢𝐬𝐭𝐨 𝐜𝐡𝐞 𝐠𝐥𝐢 𝐡𝐚 𝐟𝐚𝐭𝐭𝐨 𝐩𝐢ù 𝐝𝐢 𝟏𝟎𝟎 𝐞𝐮𝐫𝐨 𝐬𝐨𝐥𝐨 𝐝𝐢 𝐜𝐚𝐫𝐭𝐞 𝐏𝐥𝐚𝐲𝐒𝐭𝐚𝐭𝐢𝐨𝐧.
𝐒𝐞 𝐠𝐥𝐢 𝐜𝐡𝐢𝐞𝐝𝐢 𝐮𝐧 𝐟𝐚𝐯𝐨𝐫𝐞 𝐢𝐧 𝐬𝐨𝐥𝐝𝐢, 𝐭𝐞 𝐥𝐨 𝐝𝐚 𝐬𝐞𝐧𝐳𝐚 𝐩𝐫𝐨𝐛𝐥𝐞𝐦𝐢 𝐦𝐚 𝐬𝐞 𝐭𝐞 𝐥𝐨 𝐜𝐡𝐢𝐞𝐝𝐞 𝐥𝐮𝐢 𝐦𝐢 𝐫𝐚𝐜𝐜𝐨𝐦𝐚𝐧𝐝𝐨 𝐧𝐨𝐧 𝐝𝐚𝐫𝐠𝐥𝐢 𝐧𝐢𝐞𝐧𝐭𝐞.
𝐀𝐥𝐥𝐚 𝐟𝐢𝐧𝐞 𝐍𝐮𝐜𝐥𝐞𝐚𝐫 è 𝐮𝐧 𝐧𝐨𝐬𝐭𝐫𝐨 𝐜𝐚𝐫𝐨 𝐚𝐦𝐢𝐜𝐨 𝐜𝐡𝐞 𝐟𝐚 𝐫𝐢𝐝𝐞𝐫𝐞 𝐭𝐮𝐭𝐭𝐢 𝐞 𝐜𝐡𝐞 𝐧𝐞𝐬𝐬𝐮𝐧𝐨 𝐯𝐮𝐨𝐥𝐞 𝐩𝐞𝐫𝐝𝐞𝐫𝐞 .
𝐓𝐢 𝐯𝐨𝐠𝐥𝐢𝐚𝐦𝐨 𝐛𝐞𝐧𝐞 (𝐟𝐨𝐫𝐬𝐞)`;

    await conn.sendMessage(m.chat, { text: testoBanca }, { quoted: m });

    return;
  }

};

handler.help = ["nuclear"];
handler.tags = ["fun"];
handler.command = /^(nuclear|nuclearbanca)$/i;

export default handler;
