let handler = async (m, { conn }) => {

    const createVCard = (name, number, role) => {
        return `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:𝔻𝕋ℍ-𝔹𝕆𝕋;
TEL;type=CELL;type=VOICE;waid=${number}:+${number}
X-ABLabel:${role}
END:VCARD`.replace(/\n/g, '\r\n');
    };

    await conn.sendMessage(m.chat, { 
        contacts: { 
            displayName: '👥 𝔻𝕋ℍ-𝔹𝕆𝕋 Staff', 
            contacts: [
                { vcard: createVCard('Founder', '27763845778', 'Founder') },
                { vcard: createVCard('Co-Founder', '212621266387', 'Co-Founder') },
                { vcard: createVCard('Collab', '35796261367', 'Collab') },
            ]
        }
    }, { quoted: m });
};

handler.help = ['staff'];
handler.tags = ['info'];
handler.command = ['staff', 'team'];

export default handler;
