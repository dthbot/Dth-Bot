const fs = require('fs');

const bestemmiaGradi = [
  { min: 1, max: 24, nome: "Peccatore Occasionale", emoji: "😐" },
  { min: 25, max: 49, nome: "Empio Recidivo", emoji: "😶‍🌫️" },
  { min: 50, max: 74, nome: "Blasfemo Iniziato", emoji: "🩸" },
  { min: 75, max: 99, nome: "Eretico Consacrato", emoji: "🔥" },
  { min: 100, max: 149, nome: "Scomunicato Ufficiale", emoji: "🕯️" },
  { min: 150, max: 299, nome: "Profanatore Supremo", emoji: "⚰️" },
  { min: 300, max: Infinity, nome: "Avatar della Bestemmia", emoji: "⛧" }
];

const bestemmieRegex = /porco dio|porcodio|dio bastardo|dio cane|porcamadonna|madonnaporca|dio cristo|diocristo|dio maiale|diomaiale|cristo madonna|madonna impanata|dio frocio|dio gay|dio infuocato|dio crocifissato|madonna puttana|madonna vacca|madonna inculata|maremma maiala|jesu porco|diocane|padre pio|madonna troia|zoccola madonna|dio pentito/i;

module.exports = function (sock) {

  const db = {
    users: {},
    chats: {}
  };

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || !m.key.remoteJid) return;

    const chatId = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const text = (m.message.conversation || m.message.extendedTextMessage?.text || "").toLowerCase();

    // Inizializza chat
    if (!db.chats[chatId]) db.chats[chatId] = { bestemmiometro: false };

    /* ===== COMANDO ON/OFF ===== */
    if (text === ".bestemmiometro on") {
      db.chats[chatId].bestemmiometro = true;
      return sock.sendMessage(chatId, {
        text: "☠️ *Bestemmiometro attivato*\nChe Dio abbia pietà di voi."
      });
    }

    if (text === ".bestemmiometro off") {
      db.chats[chatId].bestemmiometro = false;
      return sock.sendMessage(chatId, {
        text: "🙏 *Bestemmiometro disattivato*\nRedenzione temporanea concessa."
      });
    }

    // Se disattivo, ignora tutto
    if (!db.chats[chatId].bestemmiometro) return;

    // Se non è bestemmia, ignora
    if (!bestemmieRegex.test(text)) return;

    // Inizializza utente
    if (!db.users[sender]) db.users[sender] = { blasphemy: 0 };
    const user = db.users[sender];
    user.blasphemy++;

    const grado =
      bestemmiaGradi.find(g => user.blasphemy >= g.min && user.blasphemy <= g.max)
      || { nome: "Eresiarca Anonimo", emoji: "❓" };

    const thumb = fs.readFileSync('./media/bestemmie.jpeg');

    const testo = `ೋೋ═══•═══ೋೋ
📛 𝑼𝒕𝒆𝒏𝒕𝒆: @${sender.split('@')[0]}
📊 𝑪𝒐𝒏𝒕𝒆𝒈𝒈𝒊𝒐: *${user.blasphemy}*

🎖️ 𝑮𝒓𝒂𝒅𝒐: *${grado.nome}* ${grado.emoji}
ೋೋ═══•═══ೋೋ`;

    await sock.sendMessage(chatId, {
      text: testo,
      mentions: [sender],
      contextInfo: {
        externalAdReply: {
          title: "☠️ Bestemmiometro",
          body: "Contatore ufficiale delle eresie",
          mediaType: 1,
          thumbnail: thumb,
          sourceUrl: ""
        }
      }
    });
  });
};
