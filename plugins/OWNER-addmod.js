import { existsSync, promises as fsPromises } from 'fs';
import path from 'path';

const AUTHORIZED = [
  '447880017985@s.whatsapp.net', // deadly
  '447529686760@s.whatsapp.net', // vixiie
  '48726875208@s.whatsapp.net'   // vampexa
];

const CREATOR = '447880017985@s.whatsapp.net'; // creator bot

export default async function handler(m, { conn, command, text, isAdmin, isOwner }) {
  const chatId = m.chat;
  const sender = m.sender;

  console.log(`[DEBUG] Comando ricevuto: ${command} da ${sender} in ${chatId}`);

  // inizializza struttura mod se non esiste
  if (!global.db.data.mods) global.db.data.mods = {};
  if (!global.db.data.mods[chatId]) global.db.data.mods[chatId] = {};

  // Funzione helper per ottenere target
  function getTarget() {
    if (m.mentionedJid?.length) return m.mentionedJid[0];
    if (m.quoted?.sender) return m.quoted.sender;
    if (text) return text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    return null;
  }

  const target = getTarget();

  // ------------ .addmod ------------
  if (command === 'addmod') {
    console.log('[DEBUG] Eseguito addmod');
    if (!AUTHORIZED.includes(sender)) return m.reply('❌ Non sei autorizzato a usare questo comando.');
    if (!target) return m.reply('❌ Devi menzionare l\'utente da promuovere a moderatore.');

    global.db.data.mods[chatId][target] = true;
    console.log(`[DEBUG] Mod aggiunto: ${target}`);
    return conn.sendMessage(chatId, { text: `✅ ${target.split('@')[0]} è ora moderatore!` }, { quoted: m });
  }

  // ------------ .delmod ------------
  if (command === 'delmod') {
    console.log('[DEBUG] Eseguito delmod');
    if (!AUTHORIZED.includes(sender)) return m.reply('❌ Non sei autorizzato a usare questo comando.');
    if (!target) return m.reply('❌ Devi menzionare l\'utente da rimuovere dai moderatori.');

    if (global.db.data.mods[chatId][target]) {
      delete global.db.data.mods[chatId][target];
      console.log(`[DEBUG] Mod rimosso: ${target}`);
      return conn.sendMessage(chatId, { text: `✅ ${target.split('@')[0]} non è più moderatore.` }, { quoted: m });
    } else {
      return m.reply('❌ Questo utente non è moderatore.');
    }
  }

  // ------------ .tagmod ------------
  if (command === 'tagmod') {
    console.log('[DEBUG] Eseguito tagmod');
    const mods = Object.keys(global.db.data.mods[chatId]);
    if (!mods.length) return m.reply('❌ Nessun moderatore in questo gruppo.');
    return conn.sendMessage(chatId, { text: '👥 Moderatori del gruppo:', mentions: mods }, { quoted: m });
  }

  // ------------ .dsmod ------------
  if (command === 'dsmod') {
    console.log('[DEBUG] Eseguito dsmod');
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

  // ------------ .mutamod / .smutamod ------------
  if (command === 'mutamod' || command === 'smutamod') {
    console.log(`[DEBUG] Eseguito ${command}`);
    if (!isAdmin && !global.db.data.mods[chatId][sender]) return m.reply('❌ Non puoi usare questo comando.');
    if (!target) return m.reply('❌ Devi menzionare l\'utente.');

    const user = global.db.data.users[target] = global.db.data.users[target] || {};
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