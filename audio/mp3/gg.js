//Plugin fatto da Axtral_WiZaRd
let handler = async (m, { conn }) => {
  try {
    // Percorso del file musicale
    let audioPath = './audio/mp3/videoplayback.m4a';

    // Invia il file audio come messaggio nel gruppo
    await conn.sendMessage(m.chat, { 
  audio: { url: audioPath }, 
  mimetype: 'audio/mpeg' 
});
  } catch (err) {
    console.error('𝐄𝐫𝐫𝐨𝐫𝐞 𝐧𝐞𝐥 𝐜𝐨𝐦𝐚𝐧𝐝𝐨❗', err);
    await m.reply('⚠️ 𝐄𝐫𝐫𝐨𝐫𝐞');
  }
};

handler.command = /^(tuedio)$/i;  
handler.group = true;  
handler.admin = true;  
handler.botAdmin = true;  

export default handler;
