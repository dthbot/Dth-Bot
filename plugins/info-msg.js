const handler = async (m, { conn }) => {
  try {
    // Pulsanti di aiuto
    if (m?.buttonId === '.setanni') {
      return conn.sendMessage(
        m.chat,
        { text: '📅 Usa il comando:\n.setanni <età>\n\n🗑️ Per rimuovere:\n.eliminaanni' },
        { quoted: m }
      );
    }

    if (m?.buttonId === '.setig') {
      return conn.sendMessage(
        m.chat,
        { text: '🌐 Usa il comando:\n.setig <username>\n\n🗑️ Per rimuovere:\n.delig' },
        { quoted: m }
      );
    }

    // Solo gruppi
    if (!m.isGroup) {
      return conn.sendMessage(
        m.chat,
        { text: '❌ Questo comando può essere usato solo nei gruppi.' },
        { quoted: m }
      );
    }

    // Utente target
    const mention =
      m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : m.sender;

    const who = mention || m.sender;

    // Inizializzazione utente (SAFE)
    if (!global.db.data.users[who]) {
      global.db.data.users[who] = {
        money: 0,
        warn: 0,
        messaggi: 0,
        command: 0,
        instagram: null,
        eta: null,
        genere: null
      };
    }

    const user = global.db.data.users[who];

    // Gradi
    const gradi = [
      "𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐢𝐚𝐧𝐭𝐞 𝐈 😐","𝐏𝐫𝐢𝐧𝐜𝐢𝐩𝐢𝐚𝐧𝐭𝐞 𝐈𝐈 😐",
      "𝐑𝐞𝐜𝐥𝐮𝐭𝐚 𝐈 🙂","𝐑𝐞𝐜𝐥𝐮𝐭𝐚 𝐈𝐈 🙂",
      "𝐀𝐯𝐚𝐧𝐳𝐚𝐭𝐨 𝐈 🫡","𝐀𝐯𝐚𝐧𝐳𝐚𝐭𝐨 𝐈𝐈 🫡",
      "𝐁𝐨𝐦𝐛𝐞𝐫 𝐈 😎","𝐁𝐨𝐦𝐛𝐞𝐫 𝐈𝐈 😎",
      "𝐏𝐫𝐨 𝐈 😤","𝐏𝐫𝐨 𝐈𝐈 😤",
      "𝐄́𝐥𝐢𝐭𝐞 𝐈 🤩","𝐄́𝐥𝐢𝐭𝐞 𝐈𝐈 🤩",
      "𝐌𝐚𝐬𝐭𝐞𝐫 𝐈 💪🏼","𝐌𝐚𝐬𝐭𝐞𝐫 𝐈𝐈 💪🏼",
      "𝐌𝐢𝐭𝐢𝐜𝐨 𝐈 🔥","𝐌𝐢𝐭𝐢𝐜𝐨 𝐈𝐈 🔥",
      "𝐄𝐫𝐨𝐞 𝐈 🎖","𝐄𝐫𝐨𝐞 𝐈𝐈 🎖",
      "𝐂𝐚𝐦𝐩𝐢𝐨𝐧𝐞 𝐈 🏆","𝐂𝐚𝐦𝐩𝐢𝐨𝐧𝐞 𝐈𝐈 🏆",
      "𝐃𝐨𝐦𝐢𝐧𝐚𝐭𝐨𝐫𝐞 𝐈 🥶","𝐃𝐨𝐦𝐢𝐧𝐚𝐭𝐨𝐫𝐞 𝐈𝐈 🥶",
      "𝐒𝐭𝐞𝐥𝐥𝐚𝐫𝐞 𝐈 💫","𝐒𝐭𝐞𝐥𝐥𝐚𝐫𝐞 𝐈𝐈 💫",
      "𝐂𝐨𝐬𝐦𝐢𝐜𝐨 𝐈 🔮","𝐂𝐨𝐬𝐦𝐢𝐜𝐨 𝐈𝐈 🔮",
      "𝐓𝐢𝐭𝐚𝐧𝐨 𝐈 😈","𝐓𝐢𝐭𝐚𝐧𝐨 𝐈𝐈 😈",
      "𝐋𝐞𝐠𝐠𝐞𝐧𝐝𝐚 𝐈 ⭐️","𝐋𝐞𝐠𝐠𝐞𝐧𝐝𝐚 𝐈𝐈 ⭐️"
    ];

    const livello = Math.floor((user.messaggi || 0) / 1000);
    const grado =
      livello >= 30 ? '𝐄𝐜𝐥𝐢𝐩𝐬𝐢𝐚𝐧𝐨 ❤️‍🔥' : gradi[livello] || '-';

    // Metadata gruppo
    const metadata = await conn.groupMetadata(m.chat);
    const participant = metadata.participants.find(p => p.id === who);

    const ruolo =
      who === metadata.owner
        ? '𝐅𝐨𝐮𝐧𝐝𝐞𝐫 ⚜️'
        : participant && participant.admin
        ? '𝐀𝐝𝐦𝐢𝐧 👑'
        : '𝐌𝐞𝐦𝐛𝐫𝐨 🤍';

    const emojiGenere =
      user.genere === 'maschio'
        ? '🚹'
        : user.genere === 'femmina'
        ? '🚺'
        : '𝐍𝐨𝐧 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐨';

    // Messaggio finale
    await conn.sendMessage(
      m.chat,
      {
        text: `
╔═══════════════════╗
        ✨ 𝐈𝐍𝐅𝐎 𝐔𝐓𝐄𝐍𝐓𝐄 ✨
╚═══════════════════╝

╭─── ❖ 𝐃𝐀𝐓𝐈 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋𝐈 ❖ ───╮
│ 👤 𝐔𝐭𝐞𝐧𝐭𝐞: @${who.split('@')[0]}
│ 🗓️ 𝐄𝐭𝐚̀: ${user.eta ? user.eta + ' anni' : '𝐍𝐨𝐧 𝐢𝐦𝐩𝐨𝐬𝐭𝐚𝐭𝐚'}
│ 🚻 𝐆𝐞𝐧𝐞𝐫𝐞: ${emojiGenere}
│ 🌐 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦:
│    ${user.instagram ? 'instagram.com/' + user.instagram : '𝐍𝐨𝐧 𝐢𝐦𝐩𝐨𝐬𝐭𝐨'}
╰──────────────────────╯

╭─── ❖ 𝐀𝐓𝐓𝐈𝐕𝐈𝐓𝐀̀ ❖ ───╮
│ 📝 𝐌𝐞𝐬𝐬𝐚𝐠𝐠𝐢: ${user.messaggi || 0}
│ ⚙️ 𝐂𝐨𝐦𝐚𝐧𝐝𝐢 𝐮𝐬𝐚𝐭𝐢: ${user.command || 0}
│ ⚠️ 𝐖𝐚𝐫𝐧: ${user.warn || 0} / 4
╰───────────────────╯

╭─── ❖ 𝐑𝐔𝐎𝐋𝐎 & 𝐋𝐈𝐕𝐄𝐋𝐋𝐎 ❖ ───╮
│ 🟣 𝐑𝐮𝐨𝐥𝐨: ${ruolo}
│ 🎖 𝐆𝐫𝐚𝐝𝐨: ${grado}
╰─────────────────────────╯
        `,
        mentions: [who],
        buttons: [
          { buttonId: '.setanni', buttonText: { displayText: '🗓️ Imposta Età' }, type: 1 },
          { buttonId: '.setgenere maschio', buttonText: { displayText: '🚹 Maschio' }, type: 1 },
          { buttonId: '.setgenere femmina', buttonText: { displayText: '🚺 Femmina' }, type: 1 },
          { buttonId: '.setig', buttonText: { displayText: '🌐 Imposta IG' }, type: 1 }
        ],
        footer: 'Personalizza il tuo profilo',
        viewOnce: true,
        headerType: 4
      },
      { quoted: m }
    );
  } catch (err) {
    console.error(err);
  }
};

handler.command = /^(info)$/i;
export default handler;