import fs from "fs"
import { performance } from "perf_hooks"

const handler = async (m, { conn }) => {

    // Calcolo ping reale
    const start = performance.now();
    await conn.sendMessage(m.chat, { text: "⏱️ Calcolo ping..." });
    const ping = Math.round(performance.now() - start);

    // Uptime
    const uptime = process.uptime();
    const ore = Math.floor(uptime / 3600);
    const minuti = Math.floor((uptime % 3600) / 60);
    const secondi = Math.floor(uptime % 60);

    const testo = `
🏓 *Ping:* ${ping}ms
⏳ *Uptime:* ${ore}h ${minuti}m ${secondi}s
`.trim();

    // Thumb piccola
    const thumb = fs.readFileSync("./media/ping.jpeg");

    await conn.sendMessage(m.chat, {
        image: thumb,
        caption: testo,
        jpegThumbnail: thumb // rende la foto piccola
    });
};

handler.help = ['ping'];
handler.tags = ['info'];
handler.command = /^ping$/i;

export default handler;
