```js
client.on('message', message => {
  const testo = message.body.toLowerCase();

  if (testo.includes('ti amo') || testo.includes('tiamo')) {
    message.reply(
      "💔 Puoi amare tutti tranne *Blood*.\n*Blood appartiene a Velith.*\n*Scompari.*"
    );
  }
});
