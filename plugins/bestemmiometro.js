const bestemmiaGradi = [
  { min: 1, max: 24, nome: "Peccatore Occasionale", emoji: "😐" },
  { min: 25, max: 49, nome: "Empio Recidivo", emoji: "😶‍🌫️" },
  { min: 50, max: 74, nome: "Blasfemo Iniziato", emoji: "🩸" },
  { min: 75, max: 99, nome: "Eretico Consacrato", emoji: "🔥" },
  { min: 100, max: 149, nome: "Scomunicato Ufficiale", emoji: "🕯️" },
  { min: 150, max: 299, nome: "Profanatore Supremo", emoji: "⚰️" },
  { min: 300, max: Infinity, nome: "Avatar della Bestemmia", emoji: "⛧" }
];

const bestemmieRegex =
  /porco dio|porcodio|dio bastardo|dio cane|porcamadonna|madonnaporca|dio cristo|diocristo|dio maiale|diomaiale|cristo madonna|madonna impanata|dio frocio|dio gay|dio infuocato|dio crocifissato|madonna puttana|madonna vacca|madonna inculata|maremma maiala|jesu porco|diocane|padre pio|madonna troia|zoccola madonna|dio pentito/i;

export default function (sock) {

  console.log('✅ Bestemmiometro caricato');

  const db = {
    users: {},
    chats: {}
  };

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m?.message || !m.key?.remoteJid) return;

    const chatId = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const text =
      (m.message.conversation || m.message.extendedTextMessage?.text || "")
        .toLowerCase();

    // Init chat
    if (!db.chats[chatId]) {
      db.chats[chatId] = { bestemmiometro: false };
    }

    /* ===== COMANDI ===== */
    if (text === ".bestemmiometro on") {
      db.chats[chatId].bestemmiometro = true;
      return sock.sendMessage(chatId, {
        text: "☠️ *Bestemmiometro attivato*"
      });
    }

    if (text === ".bestemmiometro off") {
      db.chats[chatId].bestemmiometro = false;
      return sock.sendMessage(chatId, {
        text: "🙏 *Bestemmiometro disattivato*"
      });
    }

    // Se disattivo → stop
    if (!db.chats[chatId].bestemmiometro) return;

    // Se non bestemmia → stop
    if (!bestemmieRegex.test(text)) return;

    // Init user
    if (!db.users[sender]) {
      db.users[sender] = { blasphemy: 0 };
    }

    const user = db.users[sender];
    user.blasphemy++;

    const grado =
      bestemmiaGradi.find(
        g => user.blasphemy >= g.min && user.blasphemy <= g.max
      ) || { nome: "Eresiarca Anonimo", emoji: "❓" };

    const testo = `ೋೋ═══•═══ೋೋ
📛 Utente: @${sender.split('@')[0]}
📊 Conteggio: *${user.blasphemy}*

🎖️ Grado: *${grado.nome}* ${grado.emoji}
ೋೋ═══•═══ೋೋ`;

    await sock.sendMessage(chatId, {
      text: testo,
      mentions: [sender]
    });
  });
                           }
