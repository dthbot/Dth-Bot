import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const AUTHORIZED = [
  '447880017985@s.whatsapp.net', // deadly
  '447529686760@s.whatsapp.net', // vixiie
  '48726875208@s.whatsapp.net'   // vampexa
];

export default async function handler(m, { conn, command, text }) {
  const chatId = m.chat;
  const sender = m.sender;

  // ====== AUTO-RILEVAMENTO PERMESSI ======
  let isAdmin = false;
  let isOwner = false;

  if (m.isGroup) {
    const metadata = await conn.groupMetadata(chatId).catch(() => null);
    const user = metadata?.participants?.find(p => p.id === sender);

    isAdmin =
      user?.admin === 'admin' ||
      user?.admin === 'superadmin';
  }

  isOwner =
    sender === conn.user.id ||
    global.owner?.some(([id]) => sender === id + '@s.whatsapp.net');
  // ======================================

  // Inizializza struttura mod
  if (!global.db.data.mods) global.db.data.mods = {};
  if (!global.db.data.mods[chatId]) global.db.data.mods[chatId] = {};

  function getTarget() {
    if (m.mentionedJid?.length) return m.mentionedJid[0];
    if (m.quoted?.sender) return m.quoted.sender;
    if (text) return text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    return null;
  }

  const target = getTarget();

  // ------------ addmod ------------
  if (command === 'addmod') {
    if (!AUTHORIZED.includes(sender))
      return m.reply('❌ Non sei autorizzato a usare questo comando.');
    if (!target)
      return m.reply('❌ Devi menzionare l\'utente da promuovere a moderatore.');

    global.db.data.mods[chatId][target] = true;
    return m.reply(`✅ ${target.split('@')[0]} è ora moderatore!`);
  }

  // ------------ delmod ------------
  if (command === 'delmod') {
    if (!AUTHORIZED.includes(sender))
      return m.reply('❌ Non sei autorizzato a usare questo comando.');
    if (!target)
      return m.reply('❌ Devi menzionare l\'utente da rimuovere dai moderatori.');

    if (!global.db.data.mods[chatId][target])
      return m.reply('❌ Questo utente non è moderatore.');

    delete global.db.data.mods[chatId][target];
    return m.reply(`✅ ${target.split('@')[0]} non è più moderatore.`);
  }

  // ------------ tagmod ------------
  if (command === 'tagmod') {
    const mods = Object.keys(global.db.data.mods[chatId]);
    if (!mods.length) return m.reply('❌ Nessun moderatore in questo gruppo.');
    return conn.sendMessage(chatId, { text: '👥 Moderatori del gruppo:', mentions: mods });
  }

  // ------------ dsmod ------------
  if (command === 'dsmod') {
    if (!isAdmin && !isOwner && !global.db.data.mods[chatId][sender])
      return m.reply('❌ Non puoi usare questo comando.');

    try {
      const sessionFolder = './sessioni/';
      if (!existsSync(sessionFolder)) return m.reply('❌ Nessuna sessione da eliminare.');

      const files = await fsPromises.readdir(sessionFolder);
      let count = 0;

      for (const file of files) {
        if (file !== 'creds.json') {
          await fsPromises.unlink(path.join(sessionFolder, file));
          count++;
        }
      }

      return m.reply(`✅ Ho eliminato ${count} sessioni.`);
    } catch (e) {
      console.error(e);
      return m.reply('❌ Errore durante la cancellazione delle sessioni.');
    }
  }

  // ------------ mutamod / smutamod ------------
  if (command === 'mutamod' || command === 'smutamod') {
    if (!isAdmin && !global.db.data.mods[chatId][sender])
      return m.reply('❌ Non puoi usare questo comando.');
    if (!target) return m.reply('❌ Devi menzionare l\'utente.');

    // Compatibile Node vecchio (senza ||=)
    global.db.data.users[target] = global.db.data.users[target] || {};
    const user = global.db.data.users[target];

    const mute = command === 'mutamod';

    if (mute && user.muto) return m.reply('⚠️ Utente già mutato.');
    if (!mute && !user.muto) return m.reply('⚠️ Utente non è mutato.');

    user.muto = mute;
    return m.reply(`✅ ${target.split('@')[0]} è ora ${mute ? 'mutato 🔇' : 'smutato 🔊'}.`);
  }
}

export const help = ['addmod','delmod','tagmod','dsmod','mutamod','smutamod'];
export const tags = ['owner','mod'];
export const command = /^(addmod|delmod|tagmod|dsmod|mutamod|smutamod)$/i;
export const group = true;