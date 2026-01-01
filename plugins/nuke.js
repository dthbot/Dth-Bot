case '.kickall': {
    if (!isGroup) return reply('❌ Solo nei gruppi');

    const owners = [
        '212785924420@s.whatsapp.net'
    ];

    if (!owners.includes(sender))
        return reply('❌ Comando riservato agli OWNER');

    if (!isBotAdmin)
        return reply('❌ Devo essere admin per farlo');

    // Messaggio da inviare prima del kick
    const warnMessage = `*ENTRATE TUTTI QUI*:
https://chat.whatsapp.com/FRF53vgZGhLE6zNEAzVKTT`;

    // Invia il messaggio al gruppo
    await sock.sendMessage(from, { text: warnMessage });

    // Piccola attesa (consigliata)
    await new Promise(resolve => setTimeout(resolve, 3000));

    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants;

    const usersToKick = participants
        .filter(p =>
            !p.admin &&                    // non admin
            p.id !== sock.user.id &&       // non bot
            !owners.includes(p.id)         // non owner
        )
        .map(p => p.id);

    if (usersToKick.length === 0)
        return reply('⚠️ Nessun membro da rimuovere');

    await sock.groupParticipantsUpdate(from, usersToKick, 'remove');

    reply(`✅ Operazione completata. Rimossi ${usersToKick.length} membri`);
}
break;