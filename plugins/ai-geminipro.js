import fetch from 'node-fetch';

const API_KEYS = [
  "AIzaSyDgwJzvsyHXL-QepGP72t835XY2X57EWDA",
  "AIzaSyBm3KriW-iEwe2kR7KVg8WoOZVYoLqjis8"
];

async function queryGemini(prompt) {
  for (let i = 0; i < API_KEYS.length; i++) {
    const key = API_KEYS[i];
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      if (!response.ok) continue;

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (reply) return reply;

    } catch (err) {
      console.warn(`Chiave ${i + 1} fallita`);
    }
  }

  return "❌ Nessuna risposta valida da Gemini.";
}

// HANDLER
var handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply("Scrivi qualcosa dopo il comando.");
  }

  try {
    await conn.sendPresenceUpdate('composing', m.chat);

    const prompt = text; // meglio NON forzare "sei gemini..."
    const reply = await queryGemini(prompt);

    await m.reply(reply);

  } catch (e) {
    console.error(e);
    await m.reply("⚠️ Errore durante la richiesta a Gemini.");
  }
};

// COMANDI
handler.command = ['ia', 'gemini', 'geminipro'];
handler.help = ['ia <testo>'];
handler.tags = ['tools'];
handler.premium = false;

export default handler;
