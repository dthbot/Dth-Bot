let handler = async (m, { conn, args, usedPrefix }) => {
    // Numeri autorizzati
    const authorizedNumbers = [
        "972594917162@s.whatsapp.net", // Creatore
        "972594917162@s.whatsapp.net"  // Nuovo numero autorizzato
    ];

    const isAuthorized = authorizedNumbers.includes(m.sender);

    if (!isAuthorized) {
        return conn.reply(
            m.chat,
`╭━━━━ ❌ ACCESSO NEGATO ❌ ━━━━╮
│
│  🚫 Solo utenti autorizzati
│  possono utilizzare questo comando
│
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
            m
        );
    }

    // Identifica l'utente target
    let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
    let amount = parseInt(args[0]);

    // Controlli di validità
    if (!amount || isNaN(amount)) {
        return conn.reply(
            m.chat,
`╭━━━━ ⚠ VALORE MANCANTE ⚠ ━━━━╮
│
│  📌 Esempio di utilizzo:
│  ▸ ${usedPrefix}addeuro 100
│  ▸ ${usedPrefix}addeuro 50 @utente
│
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
            m
        );
    }

    if (amount < 1) {
        return conn.reply(
            m.chat,
`╭━━ ❌ VALORE NON VALIDO ❌ ━━╮
│
│  🚫 Devi inserire un numero
│  maggiore di 0
│
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
            m
        );
    }

    // Operazione sul database
    try {
        if (!(who in global.db.data.users)) {
            return conn.reply(
                m.chat,
`╭━━ 🚷 UTENTE NON REGISTRATO 🚷 ━━╮
│
│  👤 L'utente non è presente
│  nel database
│
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
                m,
                { mentions: [who] }
            );
        }

        let user = global.db.data.users[who];
        user.limit = (user.limit || 0) + amount;

        let message = who === m.sender
            ? 
`╭━━ *TRANSAZIONE COMPLETATA* ━━╮
│
│  👤 Utente: *Tu*
│  💶 Importo: *+${amount} €*
│  📊 Nuovo saldo: *${user.limit} €*
│
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`
            :
`╭ *TRANSAZIONE COMPLETATA* ╮
│
│  👤 Destinatario: *@${who.split('@')[0]}*
│  💶 Importo: *+${amount} €*
│  📊 Nuovo saldo: *${user.limit} €*
│
╰━━━━━━━━━━━━━━━━━━━━╯`;

        await conn.sendMessage(
            m.chat,
            {
                text: message,
                mentions: [who]
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("Errore nell'aggiunta di Euro:", error);
        conn.reply(
            m.chat,
`╭━━━━ ❌ ERRORE CRITICO ❌ ━━━━╮
│
│  ⚠ Si è verificato un problema
│  durante l'operazione
│
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,
            m
        );
    }
};

handler.help = ['addeuro <quantità> [@utente]'];
handler.tags = ['economy', 'owner'];
handler.command = /^(addeuro)$/i;

export default handler;