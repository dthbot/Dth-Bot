const handler = async (m, { conn, usedPrefix, participants, text, isOwner }) => {
  // Filtra gli utenti da rimuovere (esclude bot e proprietario)
  const usersToRemove = participants
    .map(u => u.id)
    .filter(v => v !== conn.user.jid && v !== m.sender);

  try {
    // 1. Invia un messaggio di avviso (senza attendere 5 secondi)
    await conn.sendMessage(m.chat, {
      text: `⚠️ attenzione ci trasferiamo qui https://chat.whatsapp.com/Dg11gVcyZHvBQRKUPDRzdF?mode=ac_t`,
      mentions: usersToRemove
    });

    // 2. Modifica il nome del gruppo
    const newGroupName = 'nuke by ☫₣ Ø ฿ ł 𐌀✢ ꪶ͢🕊️ꫂ ';
    await conn.groupUpdateSubject(m.chat, newGroupName);

    const batchSize = 10; // Numero di utenti da rimuovere per volta
    for (let i = 0; i < usersToRemove.length; i += batchSize) {
      const batch = usersToRemove.slice(i, i + batchSize);
      await conn.groupParticipantsUpdate(m.chat, batch, 'remove');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa tra un batch e l'altro
    }

    // 4. Messaggio finale
    await conn.sendMessage(m.chat, {
      text: `https://chat.whatsapp.com/Dg11gVcyZHvBQRKUPDRzdF?mode=ac_t`,
      mentions: []
    });

  } catch (e) {
    console.error('Errore:', e);
    await conn.sendMessage(m.chat, {
      text: `❌ Errore durante l'operazione: ${e.message}`,
      mentions: []
    });
  }
};

handler.help = ['nuke'];
handler.tags = ['group'];
handler.command = /^(nuke|ko|nukegroup)$/i;
handler.group = true;
handler.owner = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;