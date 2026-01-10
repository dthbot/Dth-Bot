// handler-mod.js
import modHandler from './mod.js'; // <-- il file del plugin che hai postato

export async function before(m, conn) {
  try {
    if (!m.text) return;

    const prefix = '.';
    if (!m.text.startsWith(prefix)) return;

    const args = m.text.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const text = args.join(' ');

    // comandi supportati dal plugin
    const validCommands = [
      'addmod',
      'delmod',
      'tagmod',
      'dsmod',
      'mutamod',
      'smutamod'
    ];

    if (!validCommands.includes(command)) return;

    const chat = await conn.groupMetadata(m.chat).catch(() => null);
    const participants = chat?.participants || [];

    const senderData = participants.find(p => p.id === m.sender);

    const isAdmin =
      senderData?.admin === 'admin' ||
      senderData?.admin === 'superadmin';

    const isOwner =
      m.sender === conn.user.id ||
      m.sender === global.owner?.[0]?.[0] + '@s.whatsapp.net';

    // richiama il tuo plugin originale
    await modHandler(m, {
      conn,
      command,
      text,
      isAdmin,
      isOwner
    });

  } catch (err) {
    console.error('[HANDLER MOD ERROR]', err);
  }
}