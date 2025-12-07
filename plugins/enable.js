import fs from 'fs';
import fetch from 'node-fetch';

const features = [
  { key: 'antiLink',           label: 'AntiLink' },
  { key: 'antiLinkHard',       label: 'Antilinkhard' },
  { key: 'antimedia',          label: 'Antimedia' },
  { key: 'antispamcomandi',    label: 'AntispamComandi' },
  { key: 'welcome',            label: 'Benvenuto' },
  { key: 'autosticker',        label: 'Autosticker' },
  { key: 'antibot',            label: 'Antibot' },
  { key: 'detect',             label: 'Detect' },
  { key: 'risposte',           label: 'Risposte' },
  { key: 'gpt',                label: 'GPT' },
  { key: 'antispam',           label: 'Antispam' },
  { key: 'antiviewonce',       label: 'Antiviewonce' },
  { key: 'sologruppo',         label: 'SoloGruppo' },
  { key: 'soloprivato',        label: 'SoloPrivato' },
  { key: 'soloadmin',          label: 'soloadmin' },
  { key: 'isBanned',           label: 'BanGruppo' },
  { key: 'antinuke',           label: 'AntiNuke' },
  { key: 'conclave',           label: 'Conclave' },
  { key: 'antiCall',           label: 'AntiCall' },
  { key: 'antiinsta',          label: 'Antiinsta' },
  { key: 'antiporno',          label: 'Antiporno' },
  { key: 'antitrava',          label: 'Antitrava' },
  { key: 'antivirus',          label: 'Antivirus' },
  { key: 'antivoip',           label: 'Antivoip' },
  { key: 'antiArab',           label: 'Antiarab' },
  { key: 'antisondaggi',       label: 'Antisondaggi' },
  { key: 'antitiktok',         label: 'AntiTikTok' },
  { key: 'chatbotPrivato',     label: 'ChatbotPrivato', ownerOnly: true },
];

const MENU_HEADER = `
⋆ ︵︵ ★ 🔧 𝑴𝑬𝑵𝑼 𝑺𝑰𝑪𝑼𝑹𝑬𝑿𝒁𝑨 🔧 ★ ︵︵ ⋆

╭﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱
  ━━✫ ℹ 𝐂𝐎𝐌𝐄 𝐒𝐈 𝐔𝐒𝐀
  ━━✫ 🟢 attiva [funzione]
  ━━✫ 🔴 disabilita [funzione]
╰﹕₊˚ ★ ⁺˳ꕤ₊⁺・꒱

꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧
`;

const MENU_FOOTER = `
꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧

╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩
  ୧・ *𝐂𝐎𝐋𝐋𝐀𝐁:* 𝔸𝕩𝕥𝕣𝕒𝕝_𝕎𝕚ℤ𝕒ℝ𝕕
  ୧・ *𝐒𝐔𝐏𝐏𝐎𝐑𝐓𝐎:* (.supporto)
╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩
`;

const STATUS_HEADER = `<---------𝐅𝐔𝐍𝐙𝐈𝐎𝐍𝐄---------->`;
const STATUS_FOOTER = `<---------------------------------------->`;
const ONLY_OWNER_MSG = '❌ Solo il proprietario può attivare/disattivare questa funzione.';
const ONLY_PRIVATE_CHATBOT_MSG = '❌ Puoi attivare/disattivare la funzione *ChatbotPrivato* solo in chat privata.';

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isROwner }) => {
  const name = await conn.getName(m.sender);
  const chats = global.db?.data?.chats || {};
  const chatData = chats[m.chat] || {};

  const listLines = features.map(f => {
    let current =
      f.key === 'chatbotPrivato'
        ? global.privateChatbot?.[m.sender] || false
        : chatData[f.key] || false;

    const dot = current ? '🟢' : '🔴';
    const ownerTag = f.ownerOnly ? ' (Owner)' : '';
    return `୧ ${dot} *${f.label}*${ownerTag}`;
  }).join('\n');

  const menuText = (MENU_HEADER + listLines + MENU_FOOTER).trim();
  const featureArg = (args[0] || '').toLowerCase();
  const selected = features.find(f => f.label.toLowerCase() === featureArg);

  if (!selected) {
    const section = {
      title: "🔧 Funzioni",
      rows: features.map(f => ({
        title: f.label,
        description: `Attiva ${f.label}`,
        rowId: usedPrefix + 'attiva ' + f.label.toLowerCase()
      }))
    };

    await conn.sendMessage(m.chat, {
      text: menuText,
      footer: 'Seleziona una funzione da attivare/disattivare',
      title: name,
      buttonText: '⚙ Impostazioni',
      sections: [section]
    });
    return;
  }

  if (selected.ownerOnly && !(isOwner || isROwner)) {
    await conn.reply(m.chat, ONLY_OWNER_MSG, m);
    return;
  }

  // FIX: rilevazione corretta attiva/disattiva
  const isEnable = /attiva|enable|on|1|true/i.test(command);
  const isDisable = /disabilita|disattiva|disable|off|0|false/i.test(command);
  const setTo = isEnable ? true : isDisable ? false : null;

  if (setTo === null) {
    await conn.reply(m.chat, "❌ Comando non valido.", m);
    return;
  }

  if (selected.key === 'chatbotPrivato') {
    if (m.isGroup) {
      await conn.reply(m.chat, ONLY_PRIVATE_CHATBOT_MSG, m);
      return;
    }
    if (!global.privateChatbot) global.privateChatbot = {};
    global.privateChatbot[m.sender] = setTo;
  } else {
    chatData[selected.key] = setTo;
  }

  global.db.data.chats[m.chat] = chatData;

  const stateIcon = setTo ? '✅' : '❌';
  const stateVerb = setTo ? '𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚' : '𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚';

  const statusMsg = `
${STATUS_HEADER}
 ${stateIcon} ﹕ *${selected.label}* ${stateVerb} 
${STATUS_FOOTER}
`.trim();

  await conn.sendMessage(m.chat, {
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

handler.help = ['attiva <feature>', 'disabilita <feature>', 'disattiva <feature>'];
handler.tags = ['Impostazioni Bot', 'owner'];
handler.command = /^(attiva|disabilita|disattiva|enable|disable)/i;
handler.group = true;

export default handler;
