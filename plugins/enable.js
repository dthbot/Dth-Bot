import fs from 'fs';
import fetch from 'node-fetch';

const features = [
  { key: 'antiLink', label: 'AntiLink' },
  { key: 'antiLinkHard', label: 'Antilinkhard' },
  { key: 'antimedia', label: 'Antimedia' },
  { key: 'antispamcomandi', label: 'AntispamComandi' },
  { key: 'welcome', label: 'Benvenuto' },
  { key: 'autosticker', label: 'Autosticker' },
  { key: 'antibot', label: 'Antibot' },
  { key: 'detect', label: 'Detect' },
  { key: 'risposte', label: 'Risposte' },
  { key: 'gpt', label: 'GPT' },
  { key: 'antispam', label: 'Antispam' },
  { key: 'antiviewonce', label: 'Antiviewonce' },
  { key: 'sologruppo', label: 'SoloGruppo' },
  { key: 'soloprivato', label: 'SoloPrivato' },
  { key: 'soloadmin', label: 'SoloAdmin' },
  { key: 'isBanned', label: 'BanGruppo' },
  { key: 'antinuke', label: 'AntiNuke' },
  { key: 'conclave', label: 'Conclave' },
  { key: 'antiCall', label: 'AntiCall' },
  { key: 'antiinsta', label: 'Antiinsta' },
  { key: 'antiporno', label: 'Antiporno' },
  { key: 'antitrava', label: 'Antitrava' },
  { key: 'antivirus', label: 'Antivirus' },
  { key: 'antivoip', label: 'AntiVoip' },
  { key: 'antiArab', label: 'Antiarab' },
  { key: 'antisondaggi', label: 'Antisondaggi' },
  { key: 'antitiktok', label: 'AntiTikTok' },
  { key: 'chatbotPrivato', label: 'ChatbotPrivato', ownerOnly: true },
];

const STATUS_HEADER = `<---------𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐄---------->`;
const STATUS_FOOTER = `<---------------------------------------->`;

const ONLY_OWNER_MSG = '❌ Solo il proprietario può attivare/disattivare questa funzione.';
const ONLY_PRIVATE_CHATBOT_MSG = '❌ Puoi attivare/disattivare la funzione *ChatbotPrivato* solo in chat privata.';

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isROwner }) => {
  const chats = global.db.data.chats;
  const chatData = chats[m.chat] || {};

  // 🔹 Supporto: .funzione on / off
  if (/^([a-z]+)$/i.test(command) && args[0]) {
    const fn = command.toLowerCase();
    const action = args[0].toLowerCase();

    const selected = features.find(f => f.key.toLowerCase() === fn);
    if (!selected) return conn.reply(m.chat, '❌ Funzione non trovata.', m);

    const setTo = action === 'on' ? true : action === 'off' ? false : null;
    if (setTo === null) return conn.reply(m.chat, '❌ Usa: on / off', m);

    if (selected.ownerOnly && !(isOwner || isROwner))
      return conn.reply(m.chat, ONLY_OWNER_MSG, m);

    if (selected.key === 'chatbotPrivato') {
      if (m.isGroup) return conn.reply(m.chat, ONLY_PRIVATE_CHATBOT_MSG, m);
      if (!global.privateChatbot) global.privateChatbot = {};
      global.privateChatbot[m.sender] = setTo;
    } else {
      chatData[selected.key] = setTo;
      chats[m.chat] = chatData;
    }

    const statusMsg = `
${STATUS_HEADER}
 ${setTo ? '✅' : '❌'} ﹕ *${selected.label}* ${setTo ? '𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚' : '𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚'}
${STATUS_FOOTER}
`.trim();

    return conn.sendMessage(m.chat, {
      text: statusMsg,
      buttons: [
        {
          buttonId: usedPrefix + "menusicurezza",
          buttonText: { displayText: "🗿 Menu Funzioni" },
          type: 1
        }
      ],
      headerType: 1
    }, { quoted: m });
  }

  // 🔹 Supporto: .attiva funzione / .disattiva funzione
  const isEnable = /attiva|enable|on|1|true/i.test(command);
  const isDisable = /disattiva|disabilita|disable|off|0|false/i.test(command);

  if (!args[0]) return conn.reply(m.chat, "❌ Quale funzione vuoi modificare?", m);

  const featureName = args[0].toLowerCase();
  const selected = features.find(f => f.key.toLowerCase() === featureName || f.label.toLowerCase() === featureName);

  if (!selected) return conn.reply(m.chat, '❌ Funzione non trovata.', m);

  const setTo = isEnable ? true : isDisable ? false : null;

  if (setTo === null) return conn.reply(m.chat, "❌ Comando non valido.", m);

  // Proprietario?
  if (selected.ownerOnly && !(isOwner || isROwner))
    return conn.reply(m.chat, ONLY_OWNER_MSG, m);

  if (selected.key === 'chatbotPrivato') {
    if (m.isGroup) return conn.reply(m.chat, ONLY_PRIVATE_CHATBOT_MSG, m);
    if (!global.privateChatbot) global.privateChatbot = {};
    global.privateChatbot[m.sender] = setTo;
  } else {
    chatData[selected.key] = setTo;
    chats[m.chat] = chatData;
  }

  const statusMsg = `
${STATUS_HEADER}
 ${setTo ? '✅' : '❌'} ﹕ *${selected.label}* ${setTo ? '𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚' : '𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚'}
${STATUS_FOOTER}
`.trim();

  return conn.sendMessage(m.chat, {
    text: statusMsg,
    buttons: [
      {
        buttonId: usedPrefix + "menusicurezza",
        buttonText: { displayText: "🗿 Menu Funzioni" },
        type: 1
      }
    ],
    headerType: 1
  }, { quoted: m });
};


handler.help = ['attiva', 'disattiva', '<funzione> on/off'];
handler.tags = ['settings'];
handler.command = /^(attiva|disattiva|enable|disable|[a-z]+)$/i;
handler.group = true;

export default handler;
