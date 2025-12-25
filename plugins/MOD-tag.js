const handler = async (m, { conn, text, participants }) => {
  try {
    // Lista moderatori per il gruppo
    conn.groupMods = conn.groupMods || {};
    const mods = conn.groupMods[m.chat] || [];

    // Controllo permessi
    if (!mods.includes(m.sender)) {
      return m.reply('❌ Solo i moderatori possono usare questo comando.');
    }

    // Lista utenti da menzionare: tutti i moderatori
    const users = mods;

    if (m.quoted) {
      const quoted = m.quoted;

      if (quoted.mtype === 'imageMessage') {
        const media = await quoted.download();
        await conn.sendMessage(m.chat, {
          image: media,
          caption: text || quoted.text || '',
          mentions: users
        }, { quoted: m });

      } else if (quoted.mtype === 'videoMessage') {
        const media = await quoted.download();
        await conn.sendMessage(m.chat, {
          video: media,
          caption: text || quoted.text || '',
          mentions: users
        }, { quoted: m });

      } else if (quoted.mtype === 'audioMessage') {
        const media = await quoted.download();
        await conn.sendMessage(m.chat, {
          audio: media,
          mimetype: 'audio/mp4',
          mentions: users
        }, { quoted: m });

      } else if (quoted.mtype === 'documentMessage') {
        const media = await quoted.download();
        await conn.sendMessage(m.chat, {
          document: media,
          mimetype: quoted.mimetype,
          fileName: quoted.fileName,
          caption: text || quoted.text || '',
          mentions: users
        }, { quoted: m });

      } else if (quoted.mtype === 'stickerMessage') {
        const media = await quoted.download();
        await conn.sendMessage(m.chat, {
          sticker: media,
          mentions: users
        }, { quoted: m });

      } else {
        await conn.sendMessage(m.chat, {
          text: quoted.text || text || '',
          mentions: users
        }, { quoted: m });
      }

    } else if (text) {
      await conn.sendMessage(m.chat, {
        text,
        mentions: users
      }, { quoted: m });

    } else {
      return m.reply('❌ Inserisci un testo o rispondi a un messaggio/media');
    }

  } catch (e) {
    console.error('Errore tagmod:', e);
    m.reply(global.errore || '❌ Si è verificato un errore');
  }
};

handler.help = ['tagmod'];
handler.tags = ['gruppo'];
handler.command = /^\.tagmod$/i;
handler.group = true;

export default handler;