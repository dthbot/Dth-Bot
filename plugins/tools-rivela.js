let { downloadContentFromMessage } = (await import('@realvare/based'));

let handler = async (m, { conn }) => {
    if (!m.quoted) throw '📸 *Rispondi ad una foto o video 1 visualizzazione*!'

    // Controllo dei tipi validi
    let q = m.quoted;
    if (!/viewOnceMessage|viewOnceMessageV2/i.test(q.mtype))
        throw '❌ *Questo non è un messaggio 1 visualizzazione!*'

    // Estraggo il contenuto reale
    let realMsg = q.message?.viewOnceMessageV2?.message || 
                  q.message?.viewOnceMessage?.message;

    if (!realMsg) throw '⚠️ Non riesco a trovare il contenuto del view once.'

    let type = Object.keys(realMsg)[0]; // imageMessage o videoMessage

    if (!/imageMessage|videoMessage/i.test(type))
        throw '❌ *Il contenuto non è una foto/video.*'

    // Scarico il media
    let media = await downloadContentFromMessage(
        realMsg[type],
        type === 'imageMessage' ? 'image' : 'video'
    );

    let buffer = Buffer.from([]);
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    // Invio file rivelato
    if (type === 'videoMessage') {
        await conn.sendFile(m.chat, buffer, 'revealed.mp4', realMsg[type].caption || '', m);
    } else {
        await conn.sendFile(m.chat, buffer, 'revealed.jpg', realMsg[type].caption || '', m);
    }
};

handler.help = ['readvo'];
handler.tags = ['tools'];
handler.command = ['readviewonce', 'nocap', 'rivela', 'readvo'];

export default handler;
