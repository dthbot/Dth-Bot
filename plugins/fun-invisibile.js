let handler = async (m, { conn }) => {
    if (!m.isGroup) return conn.sendMessage(m.chat, { text: '❌ Comando solo per gruppi' }, { quoted: m });
    if (!m.mentionedJid || m.mentionedJid.length === 0) return conn.sendMessage(m.chat, { text: '⚠️ Devi menzionare qualcuno!\nEsempio: .invisible @utente' }, { quoted: m });

    let userTag = m.mentionedJid[0].split('@')[0];
    let messaggio = `👻 Shh! ${userTag} è diventato invisibile… Non puoi vederlo!`;

    let opzioniInoltro = inoltra("ChatUnity");
    await conn.sendMessage(m.chat, { text: messaggio, ...opzioniInoltro }, { quoted: m });
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