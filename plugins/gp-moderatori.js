const handler = async (m, { conn, participants, groupMetadata, args }) => {

    // Cooldown opzionale per tutti gli utenti
    const cooldownInMilliseconds = 6 * 60 * 60 * 1000; // 6 ore
    const lastUsed = handler.cooldowns.get(m.sender) || 0;
    const now = Date.now();

    if (now - lastUsed < cooldownInMilliseconds) {
        const timeLeft = cooldownInMilliseconds - (now - lastUsed);
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        const timeString = `${hours > 0 ? `${hours} ore, ` : ''}${minutes > 0 ? `${minutes} minuti e ` : ''}${seconds} secondi`;
        return m.reply(`⏳ Comando in cooldown! Riprova tra ${timeString}`);
    }
    handler.cooldowns.set(m.sender, now);

    // Foto del gruppo o fallback
    const foto = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './media/menu/varebotcoc.jpg';

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

${moderatori.map((jid, i) => `『 *${i + 1}.* 』@${jid.split('@')[0]}`).join('\n')}

『 🍥 』 \`Messaggio:\` » ${messaggioUtente}

> Questo comando può essere usato da chiunque nel gruppo. Usalo responsabilmente.
`.trim();

    await conn.sendMessage(m.chat, {
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
    }, { quoted: m });
};

// Inizializza la mappa per i cooldown
handler.cooldowns = new Map();

handler.help = ['moderatori <messaggio>'];
handler.tags = ['gruppo'];
handler.command = /^(moderatori|mods|staff)$/i;
handler.group = true;

export default handler;