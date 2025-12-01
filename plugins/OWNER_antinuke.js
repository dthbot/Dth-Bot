// OWNER_antinuke.js (ESM VERSIONE CORRETTA)

// Nessun require → tutto import
import fs from "fs-extra";

const OWNERS = [
  "6285134977074@s.whatsapp.net",
  "212621266387@s.whatsapp.net"
];

const BOT_NUMBERS = [
  "19703033177@s.whatsapp.net",
  "6281917478560@s.whatsapp.net"
];

const PermissionLevel = { WHITELIST: 1 };


// ───────────────────────────────────────────────────────────
// ENFORCE ANTINUKE
// ───────────────────────────────────────────────────────────
export async function enforceAntinuke(sock, antinukeService, groupJid, logger) {
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
    const targets = metadata.participants
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
      text: `🚨 *ANTI-NUKE ATTIVATO!* Rimossi *${targets.length}* admin non autorizzati.`
    });
  } catch (err) {
    logger.error(err);
  }
}


// ───────────────────────────────────────────────────────────
// EVENT HANDLER (admin change + kick)
// ───────────────────────────────────────────────────────────
export function handleAntinukeEvent(sock, antinukeService, logger) {
  return async (msg) => {
    const { key, messageStubType, messageStubParameters } = msg;

    const groupJid = key.remoteJid;
    if (!groupJid?.endsWith("@g.us")) return;

    const adminPromote = [1, 29];
    const adminDemote = [2, 30];
    const kickCodes = [40];

    const antinukeEnabled = await antinukeService.isEnabled(groupJid);
    if (!antinukeEnabled) return;

    if (adminPromote.includes(messageStubType) || adminDemote.includes(messageStubType)) {
      await enforceAntinuke(sock, antinukeService, groupJid, logger);
      return;
    }

    if (kickCodes.includes(messageStubType)) {
      await enforceAntinuke(sock, antinukeService, groupJid, logger);

      await sock.sendMessage(groupJid, {
        text: "🛡️ *ANTI-KICK:* Azione di kick rilevata e annullata."
      });

      return;
    }
  };
}


// ───────────────────────────────────────────────────────────
// COMMAND REGISTRY (ESM)
// ───────────────────────────────────────────────────────────
export function createCommandRegistry({ sock, logger, antinukeService }) {
  const commands = [
    {
      name: "antinuke",
      usage: ".antinuke on/off",
      minLevel: PermissionLevel.WHITELIST,
      handler: async (ctx) => {
        const jid = ctx.remoteJid;

        if (!jid.endsWith("@g.us")) {
          return { text: "Questo comando funziona solo nei gruppi." };
        }

        const arg = ctx.args?.[0]?.toLowerCase();

        if (!arg || !["on", "off"].includes(arg)) {
          return { text: "Uso: .antinuke on | .antinuke off" };
        }

        const enable = arg === "on";

        await antinukeService.setState(jid, enable);

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
        const jid = ctx.remoteJid;

        if (await antinukeService.isEnabled(jid)) {
          await enforceAntinuke(sock, antinukeService, jid, logger);
          return { text: "💥 AntiNuke eseguito." };
        }
        return {};
      }
    },

    {
      name: "rub",
      minLevel: PermissionLevel.WHITELIST,
      handler: async (ctx) => {
        const jid = ctx.remoteJid;

        if (await antinukeService.isEnabled(jid)) {
          await enforceAntinuke(sock, antinukeService, jid, logger);
          return { text: "🔒 RB bloccato dall'anti-nuke." };
        }
        return {};
      }
    }
  ];

  return new Map(commands.map((cmd) => [cmd.name, cmd]));
}
