let handler = async (m, { conn }) => {
    if (!m.isGroup) return conn.sendMessage(m.chat, { text: '❌ Comando solo per gruppi' }, { quoted: m });
    if (!m.mentionedJid || m.mentionedJid.length === 0) 
        return conn.sendMessage(m.chat, { text: '⚠️ Devi menzionare qualcuno!\nEsempio: .invisible @utente' }, { quoted: m });

    const userJid = m.mentionedJid[0];
    const userTag = '@' + userJid.split('@')[0]; // tag dell'utente con @
    const messaggio = `👻 Shh! ${userTag} è diventato invisibile… Non puoi vederlo!`;

    let opzioniInoltro = inoltra("ChatUnity");
    await conn.sendMessage(m.chat, { text: messaggio, mentions: [userJid], ...opzioniInoltro }, { quoted: m });
};

const inoltra = (nomeDelBot) => {
    return {
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '',
                serverMessageId: '',
                newsletterName: `${nomeDelBot}`
            }
        }
    };
};

handler.command = ["invisible", "ghost"];
export default handler;