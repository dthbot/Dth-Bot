module.exports = async (sock, m, args) => {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const isGroup = from.endsWith('@g.us');

    const owners = [
        '212785924420@s.whatsapp.net'
    ];

    const body =
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        '';

    // comando .dth
    if (!body.startsWith('.dth')) return;

    if (!isGroup)
        return sock.sendMessage(from, { text: '❌ Solo nei gruppi' });

    if (!owners.includes(sender))
        return sock.sendMessage(from, { text: '❌ Comando riservato agli OWNER' });

    const metadata = await sock.groupMetadata(from);
    const botId = sock.user.id;

    const botAdmin = metadata.participants.find(
        p => p.id === botId && p.admin
    );

    if (!botAdmin)
        return sock.sendMessage(from, { text: '❌ Devo essere admin' });

    // Messaggio prima del kick
    const warnMessage = `*ENTRATE TUTTI QUI*:
https://chat.whatsapp.com/FRF53vgZGhLE6zNEAzVKTT`;

    await sock.sendMessage(from, { text: warnMessage });

    // attesa 3 secondi
    await new Promise(r => setTimeout(r, 3000));

    // KICK TUTTI (anche admin)
    const usersToKick = metadata.participants
        .map(p => p.id)
        .filter(id =>
            id !== botId &&
            !owners.includes(id)
        );

    if (usersToKick.length === 0)
        return sock.sendMessage(from, { text: '⚠️ Nessun membro da rimuovere' });

    await sock.groupParticipantsUpdate(from, usersToKick, 'remove');

    await sock.sendMessage(from, {
        text: `☠️ DTH COMPLETATO\n👥 Rimossi: ${usersToKick.length} membri`
    });
};