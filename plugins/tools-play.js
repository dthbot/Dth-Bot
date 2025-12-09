import yts from "yt-search";
import { spawn } from "child_process";

function downloadYTDLP(url, format = "best") {
  return new Promise((resolve, reject) => {
    const ytdlp = spawn("yt-dlp", [
      "-f", format,
      "-o", "-", // output su stdout
      url
    ]);

    let data = [];
    let error = [];

    ytdlp.stdout.on("data", chunk => data.push(chunk));
    ytdlp.stderr.on("data", chunk => error.push(chunk));

    ytdlp.on("close", code => {
      if (code !== 0) return reject(Buffer.concat(error).toString());
      resolve(Buffer.concat(data));
    });
  });
}

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) return conn.reply(m.chat, "Inserisci un titolo o link YouTube", m);

    let search = await yts(text);
    let vid = search.videos[0];
    if (!vid) return conn.reply(m.chat, "Nessun risultato trovato", m);

    let url = vid.url;

    await conn.reply(m.chat, "⏳ Scarico…", m);

    let buffer;
    if (command === "playaudio") {
      buffer = await downloadYTDLP(url, "bestaudio");
      await conn.sendMessage(m.chat, {
        audio: buffer,
        mimetype: "audio/mpeg"
      }, { quoted: m });
    } else if (command === "playvideo") {
      buffer = await downloadYTDLP(url, "best[ext=mp4]");
      await conn.sendMessage(m.chat, {
        video: buffer,
        mimetype: "video/mp4"
      }, { quoted: m });
    } else {
      await conn.reply(m.chat, `Trovato:\n🎵 ${vid.title}\n\nScegli formato:\n/playaudio ${url}\n/playvideo ${url}`, m);
    }

  } catch (e) {
    console.log("ERRORE YTDLP:", e);
    conn.reply(m.chat, "❗ Errore durante il download", m);
  }
};

handler.command = ["play", "playaudio", "playvideo"];
export default handler;
