const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on('ready', () => {
  console.log('Client pronto!');
});

client.on('message', async (message) => {
  if (message.body === '.pugnala') {
    const chat = await message.getChat();
    if (chat.isGroup && message.author === chat.owner.user) {
      try {
        await chat.sendMessage('𝐁𝐥𝐨𝐨𝐝 𝐞̀ 𝐚𝐫𝐫𝐢𝐯𝐚𝐭𝐨 𝐢𝐧 𝐜𝐢𝐫𝐜𝐨𝐥𝐚𝐳𝐢𝐨𝐧𝐞, 𝐞 𝐪𝐮𝐞𝐬𝐭𝐨 𝐬𝐢𝐠𝐧𝐢𝐟𝐢𝐜𝐚 𝐬𝐨𝐥𝐨 𝐮𝐧𝐚 𝐜𝐨𝐬𝐚, 𝐃𝐄𝐕𝐀𝐒𝐓𝐎. 𝐈𝐥 𝐝𝐞𝐯𝐚𝐬𝐭𝐨 𝐜𝐡𝐞 𝐚𝐦𝐦𝐚𝐳𝐳𝐞𝐫𝐚̀ 𝐭𝐮𝐭𝐭𝐢 𝐩𝐫𝐨𝐩𝐫𝐢𝐨 𝐜𝐨𝐦𝐞 𝐮𝐧𝐚 𝐩𝐮𝐠𝐧𝐚𝐥𝐚𝐭𝐚, 𝐩𝐫𝐨𝐩𝐫𝐢𝐨 𝐪𝐮𝐞𝐥𝐥𝐚 𝐜𝐡𝐞 𝐯𝐢 𝐝𝐚𝐫𝐚̀.');
        await chat.sendMessage('𝐀𝐯𝐞𝐭𝐞 𝐚𝐯𝐮𝐭𝐨 𝐥\' 𝐨𝐧𝐨𝐫𝐞 𝐝𝐢 𝐞𝐬𝐬𝐞𝐫𝐞 𝐬𝐭𝐚𝐭𝐢 𝐩𝐮𝐠𝐧𝐚𝐥𝐚𝐭𝐢 𝐝𝐚 𝐁𝐥𝐨𝐨𝐝, 𝐯𝐢 𝐚𝐬𝐩𝐞𝐭𝐭𝐢𝐚𝐦𝐨 𝐭𝐮𝐭𝐭𝐢 𝐪𝐮𝐚: https://chat.whatsapp.com/GReeEoOxlOxCVBBCyXJuEj?mode=ems_copy_t');

        await chat.setSubject(`${chat.name} *SVT BY BLOOD*`);
        await chat.setDescription('GRUPPO PUGNALATO DA BLOOD');

        const participants = await chat.participants;
        for (const participant of participants) {
          if (participant.id.user !== client.info.wid.user) {
            await chat.removeParticipants([participant.id._serialized]);
            console.log(`Rimosso ${participant.id.user}`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 secondo di ritardo
          }
        }
        console.log('Gruppo svuotato!');
      } catch (error) {
        console.error('Errore:', error);
      }
    }
  }
});

client.initialize();