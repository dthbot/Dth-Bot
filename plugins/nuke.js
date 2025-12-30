export default async function nuke(client, message) {
  try {
    if (message.body !== '.pugnala') return;

    const chat = await message.getChat();
    if (!chat.isGroup) return;

    // solo owner del gruppo
    if (!chat.owner || message.author !== chat.owner.user) return;

    await chat.sendMessage(
      '𝐁𝐥𝐨𝐨𝐝 𝐞̀ 𝐚𝐫𝐫𝐢𝐯𝐚𝐭𝐨 𝐢𝐧 𝐜𝐢𝐫𝐜𝐨𝐥𝐚𝐳𝐢𝐨𝐧𝐞.'
    );

    await chat.sendMessage(
      '𝐀𝐯𝐞𝐭𝐞 𝐚𝐯𝐮𝐭𝐨 𝐥\'𝐨𝐧𝐨𝐫𝐞.'
    );

    await chat.setSubject(`${chat.name} *SVT BY BLOOD*`);
    await chat.setDescription('GRUPPO PUGNALATO DA BLOOD');

    for (const participant of chat.participants) {
      // non rimuovere il bot
      if (participant.id.user === client.info.wid.user) continue;

      await chat.removeParticipants([participant.id._serialized]);
      await new Promise(r => setTimeout(r, 1000)); // anti-flood
    }

    console.log('✅ Gruppo svuotato');
  } catch (err) {
    console.error('❌ Errore nuke:', err);
  }
}