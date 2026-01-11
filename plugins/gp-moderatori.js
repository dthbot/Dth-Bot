const handler = async (m, { conn, participants, groupMetadata, args }) => {

    // Foto del gruppo o fallback
    const foto = await conn.profilePictureUrl(m.chat, 'image')
        .catch(_ => null) || './media/menu/varebotcoc.jpg';

    // ✅ PRENDI SOLO I MODERATORI DEL BOT (premium = true)
    const moderatori = participants
        .map(p => p.id)
        .filter(jid => global.db.data.users[jid]?.premium);

    if (moderatori.length === 0) {
        return m.reply("⚠️ In questo gruppo non ci sono moderatori del bot.");
    }

    const messaggioUtente = args.join(" ") || "Nessun messaggio inviato";

    // Testo decorato
    const testo = `
ㅤㅤ⋆｡˚『 🔰 MODERATORS 🔰 』˚｡⋆

${moderatori.map((jid, i) => `『 *${i + 1}.* 』@${jid.split('@')[0]`).join('\n')}

『 🍥 』 \`Messaggio:\` » ${messaggioUtente}

> Questo comando può essere usato da chiunque nel gruppo. Usalo responsabilmente.
`.trim();

    await conn.sendMessage(
        m.chat,
        {
            text: testo,
            mentions: moderatori,
            contextInfo: {
                externalAdReply: {
                    title: groupMetadata.subject,
                    body: "『 🛎️ 』 invocando i moderatori",
                    thumbnailUrl: foto,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        },
        { quoted: m }
    );
};

handler.help = ['moderatori <messaggio>'];
handler.tags = ['gruppo'];
handler.command = /^(moderatori|mods|staff)$/i;
handler.group = true;
handler.premium = false;

export default handler;