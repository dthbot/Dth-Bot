// gp-rsban.js - versione ESM compatibile

import makeWASocket, {
  useSingleFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@adiwajshing/baileys";

import pino from "pino";
import fs from "fs-extra";

const { state, saveState } = useSingleFileAuthState("./auth_info_multi.json");

// Delay utility
const delay = ms => new Promise(res => setTimeout(res, ms));

export default async function gp_rsban(sock) {

  sock.ev.on("messages.upsert", async m => {
    try {
      if (!m.messages || m.type !== "notify") return;

      const msg = m.messages[0];
      if (!msg.message || msg.key.remoteJid === "status@broadcast") return;

      const from = msg.key.remoteJid;
      if (!from.endsWith("@g.us")) return;

      const sender = msg.key.participant || msg.key.remoteJid;

      let text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        "";
      text = text.trim().toLowerCase();

      // Comando
      if (text !== ".rsban") return;

      // Metadata
      const metadata = await sock.groupMetadata(from);

      const admins = metadata.participants
        .filter(p => p.admin)
        .map(p => p.id);

      const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
      const botIsAdmin = admins.includes(botId);

      // Solo admin
      if (!admins.includes(sender)) {
        return await sock.sendMessage(
          from,
          { text: "🚫 Solo gli admin possono usare questo comando." },
          { quoted: msg }
        );
      }

      if (!botIsAdmin) {
        return await sock.sendMessage(from, {
          text: "⚠️ Non posso kikkare perché non sono admin."
        });
      }

      // Membri validi
      const allMembers = metadata.participants.map(p => p.id);
      const validMembers = allMembers.filter(m => m !== botId);

      if (validMembers.length === 0) {
        return await sock.sendMessage(from, {
          text: "😢 Nessun membro da selezionare."
        });
      }

      // Animazione roulette
      await sock.sendMessage(from, { text: "🎲 Avvio della roulette ban..." }, { quoted: msg });
      await delay(1000);

      await sock.sendMessage(from, { text: "🔄 Girando la ruota..." });
      await delay(1200);

      await sock.sendMessage(from, { text: "⏳ Sta per uscire un nome..." });
      await delay(1400);

      // Scelta casuale
      const chosen = validMembers[Math.floor(Math.random() * validMembers.length)];

      // Non kikkare admin
      if (admins.includes(chosen)) {
        await sock.sendMessage(from, {
          text: "⚠️ La ruota ha scelto un admin... impossibile espellerlo 😅"
        });
        return;
      }

      // Messaggio finale
      const finalMessage =
        `✨ 𝕀𝕝 𝕡𝕣𝕖𝕤𝕔𝕖𝕝𝕥𝕠 𝕡𝕖𝕣 𝕝𝕒 𝕣𝕠𝕦𝕝𝕖𝕥𝕥𝕖 𝕓𝕒𝕟 𝕕𝕖𝕝 𝕘𝕣𝕦𝕡𝕡𝕠 è:\n\n` +
        `👉 @${chosen.split("@")[0]}\n\n` +
        `💀 *Verrà espulso dal gruppo!*`;

      await sock.sendMessage(from, { text: finalMessage, mentions: [chosen] });
      await delay(1500);

      // Kick reale
      await sock.groupParticipantsUpdate(from, [chosen], "remove");

      await sock.sendMessage(from, { text: "✅ Utente espulso con successo." });

    } catch (err) {
      console.error("ERRORE gp-rsban.js:", err);
    }
  });
}
