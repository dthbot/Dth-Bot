import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn, usedPrefix }) => {

    const menuText = `
⚡ 𝑴𝑬𝑵𝑼 𝐆𝐑𝐔𝐏𝐏𝐎 ⚡
════════════════════
🌍 *INFO & UTILITÀ*
➤ Meteo (città)
➤ Orario (città)
➤ Bus (città)
➤ Id (gruppo)
➤ Pic [@]
➤ Fp [numero]

🖼️ *MEDIA & GRAFICA*
➤ S / Sticker
➤ Wm
➤ Png
➤ Hd
➤ Rimuovisfondo (foto)

🎮 *GIOCHI & RANDOM* 
➤ Tris ⭕
➤ Dado 🎲
➤ Slot 🎰
➤ Bandiera 🏳️
➤ Classificabandiera 🚩
➤ Impiccato 👤

👤 *TAG & INTERAZIONI*
➤ Bonk [@]
➤ Hornycard [@]
➤ Stupido/a [@]
➤ Wanted [@]
➤ Nokia [@]
➤ Carcere [@]
➤ Fight [@]
➤ Sbirro [@]
➤ Teletrasporto [@]
➤ Rincoglionito [@]
➤ Mira [@]
➤ Xban [numero]
➤ Hotdog [@]

💬 *SOCIAL & AZIONI*
➤ Bacia 💋
➤ Amore 🩷
➤ Trovafida ❤️
➤ Odio 😡
➤ Rizz 🤩
➤ Minaccia ☠️
➤ Zizzania 🤡
➤ Obbligo 🚫
➤ Insulta 😹
➤ Lavoro 👷🏻
➤ Macchina 🏎️

💍 *RELAZIONI*
➤ Sposa 💍
➤ Divorzia 💔
➤ Adotta 👶🏻
➤ Famiglia 🙍🏻
➤ Coppie 👩‍❤️‍💋‍👨

💰 *ECONOMIA*
➤ Wallet 👛
➤ Banca 🏦
➤ Ruba 🕵🏽
➤ Deposita ✅
➤ Dona 👤

🎭 *VARIE*
➤ Ic 🎼
➤ Auto 🚗
➤ Sigaretta 🚬
➤ StartBlast 🚦
➤ Mc 🍔
➤ Gelato 🍦
➤ Pizza 🍕 
➤ Winx 🧚🏿
➤ Gratta 🌟
➤ Mossad
➤ Agejob [anni]

🔞 *NSFW*
➤ Tette [@]
➤ Incinta [@]
➤ Pene
➤ Sega
➤ Scopa
➤ Sborra
➤ Pompino
➤ Ditalino
════════════════════
🔖 Versione: 2.0
`.trim();

    const imagePath = path.join(__dirname, '../media/gruppo.jpeg');

    await conn.sendMessage(message.chat, {
        image: { url: imagePath },
        caption: menuText,
        footer: "Scegli un menu:",
        buttons: [
            { buttonId: `${usedPrefix}menu`, buttonText: { displayText: "🏠 Menu Principale" }, type: 1 },
            { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: "🛡️ Menu Admin" }, type: 1 },
            { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: "👑 Menu Owner" }, type: 1 },
            { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: "🚨 Menu Sicurezza" }, type: 1 },
            { buttonId: `${usedPrefix}menuia`, buttonText: { displayText: "🤖 Menu IA" }, type: 1 },
        ],
        viewOnce: true,
        headerType: 4
    });
};

handler.help = ['menugruppo'];
handler.tags = ['menugruppo'];
handler.command = /^(gruppo|menugruppo)$/i;

export default handler;
