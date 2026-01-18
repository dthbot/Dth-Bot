import yts from "yt-search";
import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

/* ================= DOWNLOAD ================= */

function downloadYTDLP(url, output, type = "audio") {
  return new Promise((resolve, reject) => {

    let args = [];

    if (type === "audio") {
      args = [
        "-f", "bestaudio[ext=m4a]/bestaudio",
        "--extract-audio",
        "--audio-format", "m4a",
        "--audio-quality", "0",
        "--no-playlist",
        "-o", output,
        url
      ];
    } else {
      args = [
        "-f", "best[ext=mp4]/best",
        "--no-playlist",
        "-o", output,
        url
      ];
    }

    console.log("YT-DLP:", args.join(" "));

    const ytdlp = spawn("yt-dlp", args);

    let stderr = "";

    ytdlp.stderr.on("data", d => stderr += d.toString());
    ytdlp.on("error", err => reject(err));

    ytdlp.on("close", code => {
      if (code !== 0) return reject(stderr);
      resolve(output);
    });
  });
}

/* ================= HANDLER ================= */

const handler = async (m, { conn, text, command }) => {
  if (!text) return conn.reply(m.chat, "✏️ Inserisci titolo o link YouTube", m);

  try {
    const search = await yts(text);
    const vid = search.videos[0];
    if (!vid) return conn.reply(m.chat, "❌ Nessun risultato trovato", m);

    const url = vid.url;
    const thumb = vid.thumbnail;
    const tmp = os.tmpdir();

    const safeTitle = vid.title
      .replace(/[/\\?%*:|"<>]/g, "_")
      .slice(0, 45);

    /* ===== AUDIO ===== */
    if (command === "playaudio-dl") {
      await conn.reply(m.chat, "🎵 Scarico audio...", m);

      const audioPath = path.join(tmp, `${safeTitle}.m4a`);
      await downloadYTDLP(url, audioPath, "audio");

      await conn.sendMessage(
        m.chat,
        {
          audio: fs.readFileSync(audioPath),
          mimetype: "audio/mp4",
          fileName: `${safeTitle}.m4a`
        },
        { quoted: m }
      );

      fs.unlinkSync(audioPath);
      return;
    }

    /* ===== VIDEO ===== */
    if (command === "playvideo-dl") {
      await conn.reply(m.chat, "🎬 Scarico video...", m);

      const videoPath = path.join(tmp, `${safeTitle}.mp4`);
      await downloadYTDLP(url, videoPath, "video");

      await conn.sendMessage(
        m.chat,
        {
          video: fs.readFileSync(videoPath),
          mimetype: "video/mp4",
          fileName: `${safeTitle}.mp4`
        },
        { quoted: m }
      );

      fs.unlinkSync(videoPath);
      return;
    }

    /* ===== BOTTONI ===== */
    await conn.sendMessage(
      m.chat,
      {
        image: { url: thumb },
        caption:
          `🎶 *${vid.title}*\n\n` +
          `⏱ Durata: ${vid.timestamp}\n` +
          `👁️ Visualizzazioni: ${vid.views}\n\n` +
          `⬇️ Scegli cosa scaricare:`,
        buttons: [
          { buttonId: `.playaudio-dl ${url}`, buttonText: { displayText: "🎵 Audio" }, type: 1 },
          { buttonId: `.playvideo-dl ${url}`, buttonText: { displayText: "🎬 Video" }, type: 1 }
        ],
        headerType: 4
      },
      { quoted: m }
    );

  } catch (err) {
    console.error("PLAY ERROR:", err);
    return conn.reply(m.chat, "❗ Errore durante il download", m);
  }
};

handler.command = ["play", "playaudio-dl", "playvideo-dl"];
export default handler;