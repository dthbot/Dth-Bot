//Plugin fatto da Axtral_WiZaRd
let telegramRegex = /(?:https?:\/\/)?(?:www\.)?(t\.me|telegram\.me)\/[^\s]*/i;

export async function before(m, { isAdmin, groupMetadata, isBotAdmin }) {
  if (m.isBaileys || m.fromMe) return true;
  if (!m.isGroup) return false;

  let chat = global.db.data.chats[m.chat];
  let warnLimit = 3;
  let senderId = m.key.participant;
  let messageId = m.key.id;
  let userData = global.db.data.users[m.sender] || {};

  const isTelegramLink = telegramRegex.exec(m.text);
  const avvisoTesto = '* ° AVVERTIMENTO ';

  if (isAdmin && chat.antitelegram && m.text.includes(avvisoTesto)) return;

  if (chat.antitelegram && isTelegramLink && !isAdmin && isBotAdmin) {
    if (!global.db.data.users[m.sender].warn) global.db.data.users[m.sender].warn = 0;
    if (!global.db.data.users[m.sender].warnReasons) global.db.data.users[m.sender].warnReasons = [];

    global.db.data.users[m.sender].warn += 1;
    global.db.data.users[m.sender].warnReasons.push('link telegram');

    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: messageId,
        participant: senderId,
      },
    });

    let warnCount = global.db.data.users[m.sender].warn;
    let userWarnData = global.db.data.users[m.sender];

    if (warnCount < warnLimit) {
      await conn.sendMessage(m.chat, {
        text: `⚠ *LINK TELEGRAM NON CONSENTITI* \n*${userWarnData.warn}${avvisoTesto}`
      });
    } else {
      global.db.data.users[m.sender].warn = 0;
      global.db.data.users[m.sender].warnReasons = [];
      m.reply('⛔ 𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎 𝐃𝐎𝐏𝐎 𝟑 𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐈');
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }
  }

  return true;
}