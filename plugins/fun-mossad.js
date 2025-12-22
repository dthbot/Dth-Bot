// Plugin per l'evento Mossad
const nomiCasuali = ['vexper', 'deadly', 'vixiie'];

const mossadPlugin = async (client, message) => {
    const { from, body, type, selectedButtonId } = message;

    // Comando principale: .mossad
    if (body === '.mossad') {
        const buttons = [
            { buttonId: 'mossad_si', buttonText: { displayText: '✅𝐒𝐢' }, type: 1 },
            { buttonId: 'mossad_no', buttonText: { displayText: '❌𝐍𝐨' }, type: 1 }
        ];

        const welcomeMessage = {
            text: "𝐁𝐮𝐨𝐧𝐚𝐬𝐞𝐫𝐚 𝐚 𝐭𝐮𝐭𝐭𝐢, 𝐞 𝐛𝐞𝐧𝐭𝐨𝐫𝐧𝐚𝐭𝐢 𝐢𝐧 𝐪𝐮𝐞𝐬𝐭𝐨 𝐧𝐮𝐨𝐯𝐨 𝐞𝐯𝐞𝐧𝐭𝐨 𝐝𝐞𝐥 𝐦𝐨𝐬𝐬𝐚𝐝 𝐝𝐢𝐫𝐞𝐭𝐭𝐨 𝐝𝐚𝐥 𝐜𝐚𝐩𝐨 𝐝𝐞𝐥 𝐦𝐨𝐬𝐬𝐚𝐝 𝐃𝐮𝐱 𝐂𝐫𝐢𝐬.\n\n⬇️ 𝐕𝐮𝐨𝐢 𝐩𝐫𝐨𝐜𝐞𝐝𝐞𝐫𝐞 𝐜𝐨𝐧 𝐥'𝐞𝐯𝐞𝐧𝐭𝐨?",
            buttons: buttons,
            headerType: 1
        };

        await client.sendMessage(from, welcomeMessage);
        return;
    }

    // Gestione della pressione dei bottoni
    if (type === 'buttons_response' || selectedButtonId) {
        
        if (selectedButtonId === 'mossad_si') {
            // Selezione casuale del nome
            const nomeScelto = nomiCasuali[Math.floor(Math.random() * nomiCasuali.length)];
            
            const messaggioSi = `𝐎𝐠𝐠𝐢 𝐩𝐚𝐫𝐥𝐞𝐫𝐞𝐦𝐨 𝐝𝐢 ${nomeScelto}, 𝐬𝐢 𝐟𝐚 𝐜𝐡𝐢𝐚𝐦𝐚𝐫𝐞 𝐚𝐝𝐞𝐬𝐜𝐚𝐭𝐨𝐫𝐞 𝐝𝐢 𝐛𝐚𝐦𝐛𝐢𝐧𝐞 𝐩𝐞𝐫𝐜𝐡é 𝐝𝐢𝐜𝐞 𝐚𝐥𝐥𝐞 𝐛𝐚𝐦𝐛𝐢𝐧𝐞 𝐝𝐢 𝐬𝐜𝐫𝐢𝐯𝐞𝐫𝐠𝐥𝐢 𝐢𝐧 𝐩𝐫𝐢𝐯𝐚𝐭𝐨 𝐩𝐞𝐫 𝐩𝐨𝐢 𝐦𝐢𝐧𝐚𝐜𝐜𝐢𝐚𝐫𝐞 𝐝𝐢 𝐝𝐨𝐱/𝐛𝐚𝐧.`;
            
            await client.sendMessage(from, { text: messaggioSi });
        } 
        
        else if (selectedButtonId === 'mossad_no') {
            const messaggioNo = "𝐄𝐯𝐞𝐧𝐭𝐨 𝐚𝐧𝐧𝐮𝐥𝐥𝐚𝐭𝐨 𝐜𝐢 𝐯𝐞𝐝𝐢𝐚𝐦𝐨 𝐥𝐚 𝐩𝐫𝐨𝐬𝐬𝐢𝐦𝐚 𝐯𝐨𝐥𝐭𝐚, 𝐛𝐚𝐜𝐢 𝐛𝐚𝐜𝐢.";
            
            await client.sendMessage(from, { text: messaggioNo });
        }
    }
};

module.exports = mossadPlugin;
              
