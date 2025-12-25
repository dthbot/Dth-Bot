const { normalizeJid } = require('../permissions');

/* ================================
   NUMERI AUTORIZZATI
================================ */
const AUTHORIZED_NUMBERS = [
  '447529688238@s.whatsapp.net',
  '447529503948@s.whatsapp.net'
];

/* ================================
   COMANDO .antinuke on/off
================================ */
const antinukeCommand = {
  name: 'antinuke',
  usage: '.antinuke <on|off>',
  minLevel: PermissionLevel.WHITELIST,
  description: 'Protegge il gruppo dalla rimozione admin non autorizzata.',
  handler: async (context) => {
    const text =
      context.message?.conversation ||
      context.message?.extendedTextMessage?.text;

    if (!text || !text.toLowerCase().startsWith('.antinuke')) return;

    if (!context.remoteJid?.endsWith('@g.us')) {
      return { text: '❌ Antinuke funziona solo nei gruppi.' };
    }

    const mode = text.split(/\s+/)[1]?.toLowerCase();
    if (mode !== 'on' && mode !== 'off') {
      return { text: '⚠️ Usa: `.antinuke on` oppure `.antinuke off`' };
    }

    const enabled = mode === 'on';
    await context.services.antinukeService.setState(
      context.remoteJid,
      enabled
    );

    return {
      text: enabled
        ? '☢️ *ANTINUKE ATTIVATO*\n🔒 Nessuno può togliere admin.'
        : '✅ *ANTINUKE DISATTIVATO*\n🔓 Protezione rimossa.'
    };
  }
};

/* ================================
   ANTINUKE AUTOMATICO (DEMOTE)
================================ */
function antinukeListener({ sock, antinukeService, logger }) {
  const isGroup = jid => jid?.endsWith('@g.us');

  const isAuthorized = (jid) => {
    if (!jid) return false;
    const normalized = normalizeJid(jid);
    const botJid = normalizeJid(sock.user?.id);
    return normalized === botJid || AUTHORIZED_NUMBERS.includes(normalized);
  };

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const m of messages) {
      // solo gruppi
      if (!isGroup(m.key?.remoteJid)) continue;

      // SOLO rimozione admin (Baileys stub 30)
      if (m.messageStubType !== 30) continue;

      const groupJid = m.key.remoteJid;
      const actor = normalizeJid(m.key.participant || m.participant);

      // antinuke spento
      if (!(await antinukeService.isEnabled(groupJid))) continue;

      // autorizzato
      if (isAuthorized(actor)) continue;

      try {
        const metadata = await sock.groupMetadata(groupJid);
        const botJid = normalizeJid(sock.user.id);

        const toDemote = metadata.participants
          .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
          .map(p => normalizeJid(p.id))
          .filter(jid =>
            jid &&
            jid !== botJid &&
            !AUTHORIZED_NUMBERS.includes(jid)
          );

        if (toDemote.length > 0) {
          await sock.groupParticipantsUpdate(groupJid, toDemote, 'demote');

          await sock.sendMessage(groupJid, {
            text:
              '☢️ *ANTINUKE ATTIVATO AUTOMATICAMENTE*\n\n' +
              '❌ Qualcuno ha tolto admin senza permesso.\n' +
              '🔻 Tutti gli admin non autorizzati sono stati rimossi.'
          });
        }

        logger?.warn(
          { groupJid, actor, demoted: toDemote.length },
          'ANTINUKE: demote admin non autorizzato'
        );
      } catch (err) {
        logger?.error({ err }, 'Errore antinuke');
      }
    }
  });
}

/* ================================
   EXPORT PLUGIN
================================ */
module.exports = {
  commands: [antinukeCommand],
  setup({ sock, antinukeService, logger }) {
    antinukeListener({ sock, antinukeService, logger });
  }
};