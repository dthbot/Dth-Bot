// Plugin fatto da Deadly
import { existsSync, promises as fs } from 'fs';
import path from 'path';
import { canUseModCommands } from '../lib/moderator.js';

const AUTHORIZED_NUMBERS = [
    '447880017985@s.whatsapp.net', // deadly
    '447529686760@s.whatsapp.net', // vixiie
    '48726875208@s.whatsapp.net'   // vampexa
];

const CREATOR = '447880017985@s.whatsapp.net';

const handler = async (m, { conn, command, text, participants, isAdmin, isOwner }) => {
    const chatId = m.chat;
    const sender = m.sender;

    // -------------------------------------------------------------
    // 🔐 .addmod / .delmod SOLO numeri autorizzati
    // -------------------------------------------------------------
    if (command === 'addmod' || command === 'delmod') {
        if (!AUTHORIZED_NUMBERS.includes(sender)) {
            return m.reply('❌ Non sei autorizzato a usare questo comando.');
        }

        const mentioned = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!mentioned) return m.reply('❌ Tagga un utente per procedere.');

        global.db.data.mods ||= {};
        global.db.data.mods[chatId] ||= {};

        if (command === 'addmod') {
            global.db.data.mods[chatId][mentioned] = true;
            return m.reply(`✅ @${mentioned.split('@')[0]} è stato aggiunto come moderatore.`, null, { mentions: [mentioned] });
        } else {
            delete global.db.data.mods[chatId][mentioned];
            return m.reply(`✅ @${mentioned.split('@')[0]} è stato rimosso dai moderatori.`, null, { mentions: [mentioned] });
        }
    }

    // -------------------------------------------------------------
    // 🔐 Altri comandi SOLO mod / admin / owner
    // -------------------------------------------------------------
    if (!canUseModCommands(m)) return m.reply('❌ Solo owner/admin/moderatori possono usare questo comando.');

    // -------------------------------------------------------------
    // 🔘 .tagmod
    // -------------------------------------------------------------
    if (command === 'tagmod') {
        const mods = Object.keys(global.db.data.mods?.[chatId] || {});
        if (mods.length === 0) return m.reply('❌ Nessun moderatore in questo gruppo.');
        const mentions = mods;
        const textToSend = '📢 Moderatori del gruppo:\n' + mods.map(u => `@${u.split('@')[0]}`).join('\n');
        return conn.sendMessage(chatId, { text: textToSend, mentions });
    }

    // -------------------------------------------------------------
    // 🔘 .dsmod
    // -------------------------------------------------------------
    if (command === 'dsmod') {
        try {
            const folder = './sessioni/';
            if (!existsSync(folder)) return m.reply('❌ Cartella sessioni vuota o inesistente.');

            const files = await fs.readdir(folder);
            let deleted = 0;
            for (const f of files) {
                if (f !== 'creds.json') {
                    await fs.unlink(path.join(folder, f));
                    deleted++;
                }
            }

            return conn.sendMessage(chatId, {
                text: deleted === 0 ? '❗ Le sessioni sono vuote' : `🔥 Eliminati ${deleted} file dalle sessioni.`,
                buttons: [
                    { buttonId: '.dsmod', buttonText: { displayText: '🔄 Svuota di nuovo' }, type: 1 },
                    { buttonId: '.ping', buttonText: { displayText: '📊 Ping' }, type: 1 }
                ],
                headerType: 1
            });
        } catch (err) {
            console.error(err);
            return m.reply('❌ Errore durante l\'eliminazione delle sessioni.');
        }
    }

    // -------------------------------------------------------------
    // 🔘 .mutamod / .smutamod
    // -------------------------------------------------------------
    if (command === 'mutamod' || command === 'smutamod') {
        const mentioned = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!mentioned) return m.reply('❌ Tagga un utente.');

        const botNumber = conn.user.jid;
        const groupMetadata = m.isGroup ? await conn.groupMetadata(chatId) : {};
        const groupOwner = groupMetadata.owner || chatId.split('-')[0] + '@s.whatsapp.net';

        if ([groupOwner, botNumber, CREATOR].includes(mentioned))
            return m.reply('❌ Non puoi mutare questo utente.');

        global.db.data.users[mentioned] ||= {};
        const user = global.db.data.users[mentioned];

        if (command === 'mutamod') {
            if (user.muto) return m.reply('⚠️ L’utente è già mutato.');
            user.muto = true;
            return m.reply(`🔇 Utente mutato: @${mentioned.split('@')[0]}`, null, { mentions: [mentioned] });
        } else {
            if (!user.muto) return m.reply('⚠️ L’utente non è mutato.');
            user.muto = false;
            return m.reply(`🔊 Utente smutato: @${mentioned.split('@')[0]}`, null, { mentions: [mentioned] });
        }
    }
};

handler.help = ['addmod','delmod','tagmod','dsmod','mutamod','smutamod'];
handler.tags = ['moderator'];
handler.command = /^(addmod|delmod|tagmod|dsmod|mutamod|smutamod)$/i;
handler.group = true;

export default handler;