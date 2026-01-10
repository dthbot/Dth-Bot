import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const AUTHORIZED = [
  '447880017985@s.whatsapp.net',
  '447529686760@s.whatsapp.net',
  '48726875208@s.whatsapp.net'
];

export default async function handler(m, { conn, command, text }) {
  const chatId = m.chat;
  const sender = m.sender;

  // ====== AUTO-RILEVAMENTO PERMESSI (SENZA MAIN) ======
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
  // ===================================================

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
      return m.reply('❌ Non sei autorizzato.');

    if (!target)
      return m.reply('❌ Devi menzionare un utente.');

    global.db.data.mods[chatId][target] = true;
    return m.reply(`✅ ${target.split('@')[0]} è ora moderatore!`);
  }

  // ------------ delmod ------------
  if (command === 'delmod') {
    if (!AUTHORIZED.includes(sender))
      return m.reply('❌ Non sei autorizzato.');

    if (!target)
      return m.reply('❌ Devi menzionare un utente.');

    if (!global.db.data.mods[chatId][target])
      return m.reply('❌ Questo utente non è moderatore.');

    delete global.db.data.mods[chatId][target];
    return m.reply(`✅ ${target.split('@')[0]} rimosso dai moderatori.`);
  }

  // ------------ tagmod ------------
  if (command === 'tagmod') {
    const mods = Object.keys(global.db.data.mods[chatId]);
    if (!mods.length) return m.reply('❌ Nessun moderatore.');
    return conn.sendMessage(chatId, {
      text: '👥 Moderatori:',
      mentions: mods
    });
  }

  // ------------ dsmod ------------
  if (command === 'dsmod') {
    if (!isAdmin && !isOwner && !global.db.data.mods[chatId][sender])
      return m.reply('❌ Permesso negato.');

    const sessionFolder = './sessioni/';
    if (!existsSync(sessionFolder))
      return m.reply('❌ Nessuna sessione.');

    const files = await fsPromises.readdir(sessionFolder);
    let count = 0;

    for (const file of files) {
      if (file !== 'creds.json') {
        await fsPromises.unlink(path.join(sessionFolder, file));
        count++;
      }
    }

    return m.reply(`✅ Eliminate ${count} sessioni.`);
  }

  // ------------ mutamod / smutamod ------------
  if (command === 'mutamod' || command === 'smutamod') {
    if (!isAdmin && !global.db.data.mods[chatId][sender])
      return m.reply('❌ Permesso negato.');

    if (!target) return m.reply('❌ Devi menzionare.');

    const user = global.db.data.users[target] ||= {};
    const mute = command === 'mutamod';

    if (mute && user.muto) return m.reply('⚠️ Già mutato.');
    if (!mute && !user.muto) return m.reply('⚠️ Non mutato.');

    user.muto = mute;
    return m.reply(`✅ ${target.split('@')[0]} ${mute ? 'mutato 🔇' : 'smutato 🔊'}`);
  }
}

export const help = ['addmod','delmod','tagmod','dsmod','mutamod','smutamod'];
export const tags = ['owner','mod'];
export const command = /^(addmod|delmod|tagmod|dsmod|mutamod|smutamod)$/i;
export const group = true;