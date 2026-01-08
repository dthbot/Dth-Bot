// Plugin fatto da deadly
import fs from 'fs';
import path from 'path';

const AUTHORIZED = [
  '447880017985@s.whatsapp.net', // deadly
  '447529686760@s.whatsapp.net', // vixiie
  '48726875208@s.whatsapp.net'   // vampexa
];

const CREATOR = '447880017985@s.whatsapp.net'; // creator bot

// Funzioni utili
function isMod(chatId, userId) {
  if (!global.db.data.mods) global.db.data.mods = {};
  if (!global.db.data.mods[chatId]) global.db.data.mods[chatId] = {};
  return !!global.db.data.mods[chatId][userId];
}

function canUseModCommands(m) {
  if (m.isOwner || m.isAdmin) return true;
  return isMod(m.chat, m.sender);
}

// ===== PLUGIN =====
const handler = async (m, { conn, command, text, isAdmin }) => {
  const chatId = m.chat;
  const sender = m.sender;

  // =======================
  // ADD / DEL MOD
  // =======================
  if (command === 'addmod' || command === 'delmod') {
    if (!AUTHORIZED.includes(sender)) return m.reply('❌ Non sei autorizzato a usare questo comando.');

    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target && text) target = text.includes('@s.whatsapp.net') ? text.trim() : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (!target) return m.reply('❌ Inserisci o menziona un utente.');

    if (!global.db.data.mods) global.db.data.mods = {};
    if (!global.db.data.mods[chatId]) global.db.data.mods[chatId] = {};

    if (command === 'addmod') {
      global.db.data.mods[chatId][target] = true;
      return m.reply(`✅ Utente ${target.split('@')[0]} aggiunto come moderatore!`);
    } else {
      delete global.db.data.mods[chatId][target];
      return m.reply(`✅ Utente ${target.split('@')[0]} rimosso dai moderatori!`);
    }
  }

  // =======================
  // TAG MOD
  // =======================
  if (command === 'tagmod') {
    if (!m.isGroup) return m.reply('❌ Comando valido solo in gruppo.');
    const mods = global.db.data.mods?.[chatId] ? Object.keys(global.db.data.mods[chatId]) : [];
    if (!mods.length) return m.reply('❌ Nessun moderatore nel gruppo.');
    const mentions = mods;
    const textTag = mods.map(u => '@' + u.split('@')[0]).join(' ');
    await conn.sendMessage(chatId, { text: textTag, mentions }, { quoted: m });
  }

  // =======================
  // DS MOD
  // =======================
  if (command === 'dsmod') {
    const sessionFolder = './sessioni/';
    if (!fs.existsSync(sessionFolder)) return m.reply('❌ La cartella sessioni non esiste.');
    const files = fs.readdirSync(sessionFolder);
    let count = 0;
    for (const f of files) {
      if (f !== 'creds.json') {
        fs.unlinkSync(path.join(sessionFolder, f));
        count++;
      }
    }
    return m.reply(`✅ Sessioni cancellate: ${count}`);
  }

  // =======================
  // MUTA / SMUTA MOD
  // =======================
  if (command === 'mutamod' || command === 'smutamod') {
    if (!canUseModCommands(m)) return m.reply('❌ Non hai permessi per usare questo comando.');
    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target && text) target = text.includes('@s.whatsapp.net') ? text.trim() : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (!target) return m.reply('❌ Inserisci o menziona un utente.');

    if (!global.db.data.users[target]) global.db.data.users[target] = {};
    const user = global.db.data.users[target];

    if (command === 'mutamod') {
      if (user.muto) return m.reply('⚠️ Utente già mutato.');
      user.muto = true;
      return m.reply(`🔇 Utente ${target.split('@')[0]} mutato.`);
    } else {
      if (!user.muto) return m.reply('⚠️ Utente non è mutato.');
      user.muto = false;
      return m.reply(`🔊 Utente ${target.split('@')[0]} smutato.`);
    }
  }
};

// Comandi
handler.command = /^(addmod|delmod|tagmod|dsmod|mutamod|smutamod)$/i;
handler.group = true;

export default handler;