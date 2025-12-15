let antinuke = false;

case '.antinukeon': {
  antinuke = true;
  await conn.sendMessage(
    m.chat,
    { text: '✅ Antinuke attivato, ora nessuno può fare il fiko 🥱' },
    { quoted: m }
  );
}
break;

case '.antinukeoff': {
  antinuke = false;
  await conn.sendMessage(
    m.chat,
    { text: '❌ Antinuke disattivato, nukkate se volete 😭' },
    { quoted: m }
  );
}
break;
