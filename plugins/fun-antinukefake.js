let antinuke = false;

export default {
  name: 'antinukefake',
  command: ['antinukeon', 'antinukeoff'],
  tags: ['group'],
  group: true,
  admin: true,

  async run(m, { conn, command }) {

    if (command === 'antinukeon') {
      antinuke = true;
      await conn.sendMessage(
        m.chat,
        { text: '✅ Antinuke attivato, ora nessuno può fare il fiko 🥱' },
        { quoted: m }
      );
    }

    if (command === 'antinukeoff') {
      antinuke = false;
      await conn.sendMessage(
        m.chat,
        { text: '❌ Antinuke disattivato, nukkate se volete 😭' },
        { quoted: m }
      );
    }

  }
};
