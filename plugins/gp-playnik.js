// playnik.js
// Comando .playnik - utilizzabile da tutti gli utenti

module.exports = {
  name: 'playnik',
  description: 'Mostra i nickname della PlayStation dei padroni',
  prefix: '.', // prefisso del comando
  command: 'playnik',
  async execute(conn, msg, args) {
    try {
      const reply = `Death : Kite_muort007 🪽
Blood : ninomegic 👾
Questi sono i nickname della play dei miei padroni ❤️`;

      // invio del messaggio (compatibile con Baileys)
      await conn.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg });

    } catch (err) {
      console.error('Errore nel comando .playnik:', err);
      await conn.sendMessage(msg.key.remoteJid, { text: 'Si è verificato un errore 😢' }, { quoted: msg });
    }
  }
};
