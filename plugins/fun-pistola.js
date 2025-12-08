import fs from 'fs';

const handler = m => m;

handler.before = async function (m, { conn }) {
    const authorizedNumbers = [
        '27747368472@s.whatsapp.net', // creatore
    ];

    const botNumber = conn.user.jid;
    const isAuthorized = jid => authorizedNumbers.includes(jid) || jid === botNumber;


    const cleanAdmins = async () => {
        const chat = global.db.data.chats[m.chat] || {};
        if (!chat.antinuke) return;

        const metadata = await conn.groupMetadata(m.chat);
        const participants = metadata.participants;

        const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        const toDemote = admins
            .map(p => p.id)
            .filter(id => !authorizedNumbers.includes(id) && id !== botNumber);

        if (toDemote.length > 0) {
            try {
                await conn.groupParticipantsUpdate(m.chat, toDemote, 'demote');
            } catch (e) {
                console.error('Errore nella rimozione degli admin:', e);
            }
        }
    };

    const body = m.message?.conversation || m.text || '';
    const godCommand = body.startsWith('.goodboy');
    const sender = m.key?.participant || m.participant || m.sender;

    if (godCommand && isAuthorized(sender)) return;


    if (m.messageStubType === 29) {
        if (!isAuthorized(sender)) {
            await cleanAdmins();
        }
    } else if (m.messageStubType === 30) {
        if (!isAuthorized(sender)) {
            await cleanAdmins();
        }
    } else if (m.messageStubType === 28) {
        if (!isAuthorized(sender)) {
          //  await cleanAdmins();
        }
    } else if (m.messageStubType === 21) {
        if (!isAuthorized(sender)) {
            await cleanAdmins();
        }
    }
};

export default handler;
