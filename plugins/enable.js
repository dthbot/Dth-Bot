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

let handler = async (m, { conn, usedPrefix, args, isOwner, isROwner }) => {

  const name = await conn.getName(m.sender);
  const chatData = global.db.data.chats[m.chat] || {};

  const listLines = features.map(f => {
    let current =
      f.key === 'chatbotPrivato'
        ? global.privateChatbot?.[m.sender] || false
        : chatData[f.key] || false;

    return `୧ ${current ? '🟢' : '🔴'} *${f.label}*${f.ownerOnly ? ' (Owner)' : ''}`;
  }).join('\n');

  const menuText = (MENU_HEADER + listLines + MENU_FOOTER).trim();

  const featureArg = (args[0] || '').toLowerCase();
  const selected = features.find(f => f.label.toLowerCase() === featureArg);

  if (!selected) {
    await conn.sendMessage(m.chat, {
      text: menuText,
      buttonText: "⚙ Impostazioni",
      footer: "Seleziona una funzione",
      title: name,
      sections: [
        {
          title: "🔧 Funzioni",
          rows: features.map(f => ({
            title: f.label,
            description: `Attiva ${f.label}`,
            rowId: usedPrefix + 'attiva ' + f.label.toLowerCase()
          }))
        }
      ]
    });
    return;
  }

  if (selected.ownerOnly && !(isOwner || isROwner))
    return conn.reply(m.chat, ONLY_OWNER_MSG, m);

  // FIX ASSOLUTO – RISOLVE TUTTO
  const text = m.text.toLowerCase();
  const isEnable = text.startsWith(`${usedPrefix}attiva`);
  const isDisable = text.startsWith(`${usedPrefix}disattiva`) || text.startsWith(`${usedPrefix}disabilita`);
  const setTo = isEnable ? true : isDisable ? false : null;

  if (setTo === null)
    return conn.reply(m.chat, "❌ Comando non valido.", m);

  if (selected.key === 'chatbotPrivato') {
    if (m.isGroup)
      return conn.reply(m.chat, ONLY_PRIVATE_CHATBOT_MSG, m);
    if (!global.privateChatbot) global.privateChatbot = {};
    global.privateChatbot[m.sender] = setTo;
  } else {
    chatData[selected.key] = setTo;
  }

  global.db.data.chats[m.chat] = chatData;

  const statusMsg = `
${STATUS_HEADER}
 ${setTo ? '✅' : '❌'} ﹕ *${selected.label}* ${setTo ? '𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚' : '𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐚'}
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

handler.help = ['attiva <feature>', '1 <feature>', 'disattiva <feature>', '0 <feature>'];
handler.tags = ['settings'];
handler.command = /^(attiva|1|disattiva|0|disabilita)/i;

export default handler;
