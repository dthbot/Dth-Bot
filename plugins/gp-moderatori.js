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

    // Trova i moderatori del gruppo automaticamente
    const moderatori = participants.filter(p => p.admin);

    if (moderatori.length === 0) {
        return m.reply("⚠️ In questo gruppo non ci sono moderatori.");
    }

    const mentionList = moderatori.map(p => p.id);
    const messaggioUtente = args.join(" ") || "Nessun messaggio inviato";

    // Testo decorato
    const testo = `ㅤㅤ⋆｡˚『 🔰 MODERATORS 🔰 』˚｡⋆\n\n${moderatori.map((mod, i) => `『 *${i + 1}.* 』@${mod.id.split('@')[0]}`).join('\n')}\n\n『 🍥 』 \`Messaggio:\` » ${messaggioUtente}\n\n> Questo comando può essere usato da chiunque nel gruppo. Usalo responsabilmente.`.trim();

    await conn.sendMessage(m.chat, {
        text: testo,
        contextInfo: {
            mentionedJid: mentionList,
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

// Tutti possono usarlo
handler.premium = false;

export default handler;