// Plugin fatto da Deadly

import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

const AUTHORIZED = [
  '447880017985@s.whatsapp.net', // deadly
  '447529686760@s.whatsapp.net', // vixiie
  '48726875208@s.whatsapp.net'   // vampexa
];

// ====== HELPERS ======

function isMod(chatId, userId) {
  if (!global.db.data.mods) return false;
  if (!global.db.data.mods[chatId]) return false;
  return !!global.db.data.mods[chatId][userId];
}

function canUseModCommands(chatId, userId) {
  if (AUTHORIZED.includes(userId)) return true; // owner globale
  return isMod(chatId, userId);
}

// ====== HANDLER PRINCIPALE ======

const handler = async (m, { conn, text, command }) => {
  const chatId = m.chat;
  const sender = m.sender;

  // ===== .addmod =====
  if (command === 'addmod') {
    if (!AUTHORIZED.includes(sender)) return m.reply('❌ Solo owner autorizzati possono usare questo comando.');

    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target && text) target = text.includes('@') ? text.trim() : text + '@s.whatsapp.net';
    if (!target) return m.reply('❌ Specifica l\'utente da rendere moderatore.');

    global.db.data.mods ||= {};
    global.db.data.mods[chatId] ||= {};
    global.db.data.mods[chatId][target] = true;

    return conn.sendMessage(chatId, { text: `✅ ${target.split('@')[0]} è ora un moderatore!` }, { quoted: m });
  }

  // ===== .delmod =====
  if (command === 'delmod') {
    if (!AUTHORIZED.includes(sender)) return m.reply('❌ Solo owner autorizzati possono usare questo comando.');

    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target && text) target = text.includes('@') ? text.trim() : text + '@s.whatsapp.net';
    if (!target) return m.reply('❌ Specifica l\'utente da rimuovere dai moderatori.');

    if (global.db.data.mods?.[chatId]?.[target]) {
      delete global.db.data.mods[chatId][target];
      return conn.sendMessage(chatId, { text: `✅ ${target.split('@')[0]} non è più un moderatore.` }, { quoted: m });
    }
    return m.reply('❌ L\'utente non è un moderatore.');
  }

  // ===== .tagmod =====
  if (command === 'tagmod') {
    if (!canUseModCommands(chatId, sender)) return m.reply('❌ Non sei autorizzato.');

    const mods = Object.keys(global.db.data.mods?.[chatId] || {});
    if (!mods.length) return m.reply('❌ Nessun moderatore in questo gruppo.');

    const mentions = mods;
    const textTag = '👑 Moderatori del gruppo:\n' + mods.map(mj => `@${mj.split('@')[0]}`).join('\n');

    return conn.sendMessage(chatId, { text: textTag, mentions });
  }

  // ===== .dsmod =====
  if (command === 'dsmod') {
    if (!canUseModCommands(chatId, sender)) return m.reply('❌ Non sei autorizzato.');

    try {
      const sessionFolder = './sessioni/';
      if (!fs.existsSync(sessionFolder)) return m.reply('❌ La cartella sessioni non esiste.');

      const files = await fsPromises.readdir(sessionFolder);
      let count = 0;
      for (const file of files) {
        if (file !== 'creds.json') {
          await fsPromises.unlink(path.join(sessionFolder, file));
          count++;
        }
      }
      return m.reply(`✅ Eliminati ${count} file dalle sessioni.`);
    } catch (err) {
      console.error(err);
      return m.reply('❌ Errore nello svuotamento delle sessioni.');
    }
  }

  // ===== .mutamod / .smutamod =====
  if (command === 'mutamod' || command === 'smutamod') {
    if (!canUseModCommands(chatId, sender)) return m.reply('❌ Non sei autorizzato.');

    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target && text) target = text.includes('@') ? text.trim() : text + '@s.whatsapp.net';
    if (!target) return m.reply('❌ Specifica un utente.');

    global.db.data.users[target] ||= {};
    const isMute = command === 'mutamod';

    if (isMute) {
      if (global.db.data.users[target].muto) return m.reply('⚠️ Utente già mutato.');
      global.db.data.users[target].muto = true;
      return conn.sendMessage(chatId, { text: `🔇 ${target.split('@')[0]} è stato mutato.` }, { mentions: [target] });
    } else {
      if (!global.db.data.users[target].muto) return m.reply('⚠️ Utente non è mutato.');
      global.db.data.users[target].muto = false;
      return conn.sendMessage(chatId, { text: `🔊 ${target.split('@')[0]} è stato smutato.` }, { mentions: [target] });
    }
  }
};

// ====== CONFIG ======
handler.command = /^(addmod|delmod|tagmod|dsmod|mutamod|smutamod)$/i;
handler.group = true;

export default handler;