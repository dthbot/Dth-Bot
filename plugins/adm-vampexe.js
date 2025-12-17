const fs = require('fs');

module.exports = async (client, message) => {
    // Trasforma il testo in minuscolo per evitare errori di battitura
    const body = message.body.toLowerCase();

    if (body === 'vampexe') {
        const imagePath = './media/vamp1.jpeg';
        const caption = "𝐕𝐚𝐦𝐩𝐞𝐱𝐞 è 𝐥𝐚 𝐦𝐨𝐠𝐥𝐢𝐞 𝐝𝐢 𝕯𝖊ⱥ𝖉𝖑𝐲, 𝐭𝐮𝐭𝐭𝐢 𝐬𝐚𝐧𝐧𝐨 𝐜𝐡𝐞 𝐧𝐨𝐧 𝐥𝐚 𝐝𝐞𝐯𝐨𝐧𝐨 𝐭𝐨𝐜𝐜𝐚𝐫𝐞 𝐬𝐞𝐧𝐧ò 𝐬𝐨𝐧𝐨 𝐠𝐮𝐚𝐢 🖤";

        // Verifica se il file esiste prima di inviarlo
        if (fs.existsSync(imagePath)) {
            await client.sendMessage(message.from, {
                image: { url: imagePath },
                caption: caption,
                // L'opzione viewOnce: true imposta la foto in modalità "x1"
                viewOnce: true 
            });
        } else {
            console.error("Errore: Il file media/vamp1.jpeg non è stato trovato.");
        }
    }
};
