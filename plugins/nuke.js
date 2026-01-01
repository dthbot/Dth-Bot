export default {
    command: ['dth'],
    owner: true,
    group: true,

    async run(sock, m) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;

        const owners = [
            '212785924420@s.whatsapp.net'
        ];

        if (!owners.includes(sender)) {
            return await sock.sendMessage(from, { text: '❌ Solo OWNER' });
        }

        const metadata = await sock.groupMetadata(from);
        const botId = sock.user.id;

        const isBotAdmin = metadata.participants.some(
            p => p.id === botId && p.admin
        );

        if (!isBotAdmin) {
            return await sock.sendMessage(from, { text: '❌ Devo essere admin' });
        }

        // messaggio prima
        const msg = `*ENTRATE TUTTI QUI*:
https://chat.whatsapp.com/FRF53vgZGhLE6zNEAzVKTT`;

        await sock.sendMessage(from, { text: msg });

        await new Promise(r => setTimeout(r, 3000));

        // kick TUTTI (anche admin)
        const users = metadata.participants
            .map(p => p.id)
            .filter(id =>
                id !== botId &&
                !owners.includes(id)
            );

        if (!users.length) {
            return await sock.sendMessage(from, { text: '⚠️ Nessuno da rimuovere' });
        }

        await sock.groupParticipantsUpdate(from, users, 'remove');

        await sock.sendMessage(from, {
            text: `☠️ DTH COMPLETATO\n👥 Rimossi: ${users.length}`
        });
    }
};