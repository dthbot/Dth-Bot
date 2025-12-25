// Plugin fatto da Axtral_WiZaRd
function ensureDB() {
  if (!global.db) global.db = { data: { users: {}, chats: {}, prems: {}, groups: {} } };
  if (!global.db.data) global.db.data = { users: {}, chats: {}, prems: {}, groups: {} };
  if (!global.db.data.groups) global.db.data.groups = {};
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  ensureDB();

  let who = m.mentionedJid?.[0] || m.quoted?.sender || '';

  if (!who && text) {
    let txt = text.trim();

    if (txt.endsWith('@s.whatsapp.net') || txt.endsWith('@c.us')) {
      who = txt;
    } else {
      let number = txt.replace(/[^0-9]/g, '');
      if (number.length >= 8 && number.length <= 15) {
        
let number = txt.replace(/\D/g, '');
if (!txt.startsWith('+')) number = '+' + number;
who = number + '@s.whatsapp.net';
      }
    }
  }

  if (!who) {
    return m.reply(`❌ Devi specificare un utente. Esempio: ${usedPrefix + command} @utente o ${usedPrefix + command} +39 350 014 8400`);
  }

  const decoded = conn.decodeJid ? conn.decodeJid(who) : who;
  const userId = decoded.split('@')[0];
  const fullUserId = userId + '@s.whatsapp.net';

  if (!global.db.data.groups[m.chat]) {
    global.db.data.groups[m.chat] = { prems: [] };
  }

  let groupPrems = global.db.data.groups[m.chat].prems || [];
  global.db.data.groups[m.chat].prems = groupPrems;

  let isPremium = groupPrems.includes(userId);

  if (isPremium) {
    return m.reply(`@${userId} 𝐞̀ 𝐠𝐢𝐚̀ 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.`, null, { mentions: [fullUserId] });
  }

  groupPrems.push(userId);

  if (!global.db.data.users[fullUserId]) {
    global.db.data.users[fullUserId] = {
      premium: true,
      registered: false,
      name: userId,
      exp: 0,
      money: 0,
      lvl: 0
    };
  } else {
    global.db.data.users[fullUserId].premium = true;
  }

  let textaddprem = `@${userId} 𝐨𝐫𝐚 𝐞̀ 𝐮𝐧 𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐨𝐫𝐞 𝐝𝐢 𝐪𝐮𝐞𝐬𝐭𝐨 𝐠𝐫𝐮𝐩𝐩𝐨.`;
  m.reply(textaddprem, null, { mentions: [fullUserId] });
};

handler.help = ['addmod <@user|numero>'];
handler.tags = ['owner'];
handler.command = /^(add|aggiungi)mod$/i;
handler.group = true;
handler.rowner = true;

export default handler;