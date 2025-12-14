let handler = async (m, { conn }) => {

    const createVCard = (name, number, role) => {
        return `BEGIN:VCARD
VERSION:2.0
FN:${name}
ORG:DthBot;
TEL;type=CELL;type=VOICE;waid=${number}:+${number}
X-ABLabel:${role}
END:VCARD`.replace(/\n/g, '\r\n');
    };

    await conn.sendMessage(m.chat, { 
        contacts: { 
            displayName: '👥 𝔻𝕋ℍ-𝔹𝕆𝕋 Staff', 
            contacts: [
                { vcard: createVCard('Creatore', '573185650790', 'Founder') },
                { vcard: createVCard('Owner2', '447423133507', 'Owner2') }
            ]
        }
    }, { quoted: m });
};

handler.help = ['staff'];
handler.tags = ['info'];
handler.command = ['staff', 'team'];

export default handler;
