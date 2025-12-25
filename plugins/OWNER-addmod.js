let handler = async (m, { conn, usedPrefix }) => {
    const ownerIDs = ['447529688238@s.whatsapp.net','447529503948@s.whatsapp.net','48426875208@s.whatsapp.net','212775499775@s.whatsapp.net'];
    if (!ownerIDs.includes(m.sender)) return m.reply('❌ Solo l’owner può usare questo comando');

    const chat = m.chat;
    conn.groupMods = conn.groupMods || {};
    conn.groupMods[chat] = conn.groupMods[chat] || [];

    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply(`❌ Usa: ${usedPrefix}addmod @utente`);

    if (!conn.groupMods[chat].includes(target)) {
        conn.groupMods[chat].push(target);
        m.reply(`✅ @${target.split('@')[0]} è ora moderatore`, null, { mentions: [target] });
    } else {
        m.reply(`ℹ️ @${target.split('@')[0]} è già moderatore`, null, { mentions: [target] });
    }
}

handler.command = ['addmod'];
handler.group = true;
export default handler;