import fetch from 'node-fetch';
import FormData from 'form-data';
import { downloadContentFromMessage } from '@chatunity/baileys';

const linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})|whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;
const urlRegex = /(https?:\/\/[^\s]+)/g;

function extractTextAndUrlsFromMessage(message) {
    const extractedContent = { text: '', urls: [] };
    if (!message) return extractedContent;

    function findContentInObject(obj) {
        if (typeof obj === 'string') {
            extractedContent.text += ' ' + obj;
            const foundUrls = obj.match(urlRegex);
            if (foundUrls) extractedContent.urls.push(...foundUrls);
        } else if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                if (Object.hasOwn(obj, key)) findContentInObject(obj[key]);
            }
        }
    }

    findContentInObject(message);
    return {
        text: extractedContent.text.trim(),
        urls: [...new Set(extractedContent.urls)]
    };
}

async function getMediaBuffer(message) {
    try {
        const msg =
            message.message?.imageMessage ||
            message.message?.videoMessage ||
            message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
            message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;

        if (!msg) return null;

        const type = msg.mimetype?.startsWith('video') ? 'video' : 'image';
        const stream = await downloadContentFromMessage(msg, type);

        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        return buffer;
    } catch (e) {
        console.error('Errore nel download media:', e);
        return null;
    }
}

async function readQRCode(imageBuffer) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const formData = new FormData();
        formData.append('file', imageBuffer, 'image.jpg');

        const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
            method: 'POST',
            body: formData,
            signal: controller.signal
        });

        clearTimeout(timeout);
        const data = await response.json();
        return data?.[0]?.symbol?.[0]?.data || null;
    } catch (e) {
        console.error('Errore lettura QR:', e);
        return null;
    }
}

// Funzione principale
export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    const chat = global.db.data.chats[m.chat];
    const userTag = `@${m.sender.split('@')[0]}`;

    // Se il mittente è admin, ignora
    if (isAdmin) return true;

    // Controllo contenuto e link
    const { text: messageText, urls: extractedUrls } =
        extractTextAndUrlsFromMessage(m.message || {});

    let containsGroupLink =
        !!linkRegex.exec(messageText) ||
        extractedUrls.some(url => linkRegex.exec(url));

    let qrLinkDetected = false;

    // Se non ci sono link nel testo, controlla QR nelle immagini/video
    if (!containsGroupLink) {
        const media = await getMediaBuffer(m);
        if (media) {
            const qrData = await readQRCode(media);
            const qrText = qrData?.replace(/[\s\u200b\u200c\u200d\uFEFF]+/g, '') ?? '';
            if (qrText && linkRegex.test(qrText)) {
                containsGroupLink = true;
                qrLinkDetected = true;
            }
        }
    }

    if (!chat?.antiLink) return true;
    if (!containsGroupLink) return true;

    // Controlla se il messaggio è un forward di admin
    const quotedAdmin = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quotedAdmin) {
        const senderOfQuoted = m.message.extendedTextMessage.contextInfo.participant;
        const isQuotedAdmin = global.db.data.users[senderOfQuoted]?.isAdmin;
        if (isQuotedAdmin) return true; // Non dare warn se è un forward da admin
    }

    // Gestione warn
    let user = global.db.data.users[m.sender];
    if (!user.warn) user.warn = 0;
    if (!user.warnReasons) user.warnReasons = [];

    user.warn++;
    user.warnReasons.push('link');

    if (user.warn < 3) {
        await conn.sendMessage(m.chat, {
            text:
`⚠️ *ANTI-LINK ATTIVO*

👤 Utente: ${userTag}
📌 Avvertimento: *${user.warn}/3*
${qrLinkDetected ? '📷 Link rilevato da QR' : ''}

⛔ Alla terza violazione verrai rimosso`,
            mentions: [m.sender]
        });
    } else {
        user.warn = 0;
        user.warnReasons = [];

        if (!isBotAdmin) return true;

        await conn.sendMessage(m.chat, {
            text:
`⛔ *UTENTE RIMOSSO*

👤 ${userTag}
📌 Motivo: *Link WhatsApp*`,
            mentions: [m.sender]
        });

        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }

    return true;
}