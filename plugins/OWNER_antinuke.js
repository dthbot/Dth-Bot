// antinuke-full.js

const fs = require("fs-extra");

// JID da proteggere
const OWNERS = [
  "6285134977074@s.whatsapp.net",
  "212621266387@s.whatsapp.net"
];

const BOT_NUMBERS = [
  "19703033177@s.whatsapp.net",
  "6281917478560@s.whatsapp.net"
];

// Livello permessi
const PermissionLevel = { WHITELIST: 1 };


// ─────────────────────────────────────────────
// ENFORCE ANTINUKE / ANTIKICK
// ─────────────────────────────────────────────
async function enforceAntinuke(sock, antinukeService, groupJid, logger) {
  logger.info({ jid: groupJid }, "AntiNuke enforcement triggered.");

  const metadata = await sock.groupMetadata(groupJid);
  const botJid = sock.user.id.includes("@")
    ? sock.user.id
    : `${sock.user.id}@s.whatsapp.net`;

  const isBotAdmin = metadata.participants.some(
    (p) => p.id === botJid && p.admin !== null
  );

  if (!isBotAdmin) {
    return sock.sendMessage(groupJid, {
      text: "⚠️ *ANTI-NUKE FALLITO:* Non sono amministratore."
    });
  }

  try {
    const participants = metadata.participants;

    const targets = participants
      .filter(
        (p) =>
          p.admin !== null &&
          !OWNERS.includes(p.id) &&
          !BOT_NUMBERS.includes(p.id)
      )
      .map((p) => p.id);

    if (targets.length === 0) return;

    await sock.groupParticipantsUpdate(groupJid, targets, "demote");

    await sock.sendMessage(groupJid, {
      text: `🚨 *ANTI-NUKE ATTIVATO!* Demotati *${targets.length}* admin esterni.`
    });
  } catch (err) {
    logger.error(err);
  }
}


// ─────────────────────────────────────────────
// HANDLER EVENTI (ADMIN CHANGE + KICK)
// ─────────────────────────────────────────────
function handleAntinukeEvent(sock, antinukeService, logger) {
  return async (msg) => {
    const { key, messageStubType, messageStubParameters } = msg;

    const groupJid = key.remoteJid;
    if (!groupJid?.endsWith("@g.us")) return;

    // codici Baileys
    const adminPromotionCodes = [1, 29];
    const adminDemotionCodes = [2, 30];
    const kickCodes = [40];

    const isAdminChange =
      adminPromotionCodes.includes(messageStubType) ||
      adminDemotionCodes.includes(messageStubType);

    const isKick = kickCodes.includes(messageStubType);

    const antinukeEnabled = await antinukeService.isEnabled(groupJid);
    if (!antinukeEnabled) return;

    // 🛡️ ANTI-ADMIN CHANGE
    if (isAdminChange) {
      await enforceAntinuke(sock, antinukeService, groupJid, logger);
      return;
    }

    // 🛡️ ANTI-KICK
    if (isKick) {
      const whoWasKicked = messageStubParameters?.[0];
      const whoDidIt = msg.participant;

      logger.warn(`ANTI-KICK: ${whoDidIt} ha espulso ${whoWasKicked}`);

      await enforceAntinuke(sock, antinukeService, groupJid, logger);

      await sock.sendMessage(groupJid, {
        text: `🛡️ *ANTI-KICK ATTIVO*\nUn kick è stato rilevato. Admin esterni rimossi.`
      });

      return;
    }
  };
}


// ─────────────────────────────────────────────
// COMMAND REGISTRY
// ─────────────────────────────────────────────
function createCommandRegistry({ sock, logger, antinukeService }) {
  const commands = [
    {
      name: "antinuke",
      usage: ".antinuke on/off",
      minLevel: PermissionLevel.WHITELIST,
      description: "Attiva o disattiva l'anti-nuke.",
      handler: async (ctx) => {
        const remoteJid = ctx.remoteJid;
        if (!remoteJid?.endsWith("@g.us")) {
          return { text: "Questo comando funziona solo nei gruppi." };
        }

        const arg = ctx.args?.[0]?.toLowerCase();

        if (!arg || !["on", "off"].includes(arg)) {
          return {
            text: "Uso corretto:\n\n.antinuke on\n.antinuke off"
          };
        }

        const enable = arg === "on";
        await antinukeService.setState(remoteJid, enable);

        return {
          text: enable
            ? "🛡️ *AntiNuke attivato.*"
            : "🔴 *AntiNuke disattivato.*"
        };
      }
    },

    {
      name: "nuke",
      minLevel: PermissionLevel.WHITELIST,
      handler: async (ctx) => {
        const remoteJid = ctx.remoteJid;

        if (await antinukeService.isEnabled(remoteJid)) {
          await enforceAntinuke(sock, antinukeService, remoteJid, logger);
          return { text: "💥 AntiNuke attivo. Admin esterni rimossi." };
        }
        return {};
      }
    },

    {
      name: "rub",
      minLevel: PermissionLevel.WHITELIST,
      handler: async (ctx) => {
        const remoteJid = ctx.remoteJid;

        if (await antinukeService.isEnabled(remoteJid)) {
          await enforceAntinuke(sock, antinukeService, remoteJid, logger);
          return { text: "🔒 AntiNuke attivo. RB bloccato." };
        }
        return {};
      }
    }
  ];

  return new Map(commands.map((cmd) => [cmd.name, cmd]));
}

module.exports = {
  createCommandRegistry,
  handleAntinukeEvent
};
