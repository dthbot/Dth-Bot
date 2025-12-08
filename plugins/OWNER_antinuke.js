import fs from 'fs';

const handler = m => m;

handler.before = async function (m, { conn }) {

    // NUMERO CREATORE
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

        const admins = participants.filter(
            p => p.admin === 'admin' || p.admin === 'superadmin'
        );

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
    const sender = m.key?.participant || m.participant || m.sender;

    // 🔥 NUOVO COMANDO: .antinuke on/off
    if (body.startsWith('.antinuke')) {
        if (!isAuthorized(sender)) return;

        let arg = body.split(' ')[1];
        if (!arg) return conn.sendMessage(m.chat, { text: "Usa:\n.antinuke on\n.antinuke off" });

        global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};

        if (arg === 'on') {
            global.db.data.chats[m.chat].antinuke = true;
            return conn.sendMessage(m.chat, { text: "🟢 Antinuke attivato!" });
        } else if (arg === 'off') {
            global.db.data.chats[m.chat].antinuke = false;
            return conn.sendMessage(m.chat, { text: "🔴 Antinuke disattivato!" });
        } else {
            return conn.sendMessage(m.chat, { text: "Valore non valido. Usa on/off." });
        }
    }

    // Eventi di sicurezza
    if (m.messageStubType === 29) {
        if (!isAuthorized(sender)) await cleanAdmins();
    } else if (m.messageStubType === 30) {
        if (!isAuthorized(sender)) await cleanAdmins();
    } else if (m.messageStubType === 21) {
        if (!isAuthorized(sender)) await cleanAdmins();
    }
};

export default handler;
