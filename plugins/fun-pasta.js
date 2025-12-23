let handler = async (m, { conn, mentionedJid }) => {
    // Chi riceve il piatto
    let destinatario = mentionedJid && mentionedJid.length > 0 ? mentionedJid[0] : m.sender;
    let user = `@${destinatario.split("@")[0]}`;

    // Messaggio principale decorato
    let messaggio = `
🍝✨ *SPAGHETTI TIME!* ✨🍝

🥄 Ciao ${user}! Oggi ti porto un piatto speciale di spaghetti fumanti! 🔥

🍅 *Ingredienti speciali*: Amore ❤️, Allegria 😆, Sorrisi 😋

🍽️ *Consiglio dello chef*: Mangia con calma, chiacchiera e goditi ogni forchettata! 🍝

💫 *Buon appetito!* 💫
`;

    // Lista immagini sicure e funzionanti
    let immagini = [
        "https://cdn.pixabay.com/photo/2017/10/18/14/45/spaghetti-2867252_1280.jpg",
        "https://cdn.pixabay.com/photo/2014/04/22/02/56/spaghetti-329399_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/09/02/12/53/spaghetti-918845_1280.jpg",
        "https://cdn.pixabay.com/photo/2017/03/12/13/41/spaghetti-2131248_1280.jpg"
    ];

    // Scegli immagine casuale
    let imageUrl = immagini[Math.floor(Math.random() * immagini.length)];

    // Invia messaggio con immagine e menzione
    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: messaggio,
        mentions: [destinatario]
    }, { quoted: m });
};

handler.command = ["spaghetti","pasta"];
handler.category = "fun";
handler.desc = "Manda un piatto di spaghetti a qualcuno 🍝";

export default handler;