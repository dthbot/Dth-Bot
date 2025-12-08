import yts from 'yt-search';
import axios from 'axios';

const MAX_DURATION = 600; // 5 minuti in secondi
const REQUEST_TIMEOUT = 10000; // 10s per chiamata API

// Lista di API fallback: template e funzione per estrarre l'url audio/video dalla risposta
const FALLBACK_APIS = [
  {
    name: 'guruapi (audio/video)',
    audio: (u) => `https://api.guruapi.tech/api/ytmp3?url=${encodeURIComponent(u)}`,
    video: (u) => `https://api.guruapi.tech/api/ytmp4?url=${encodeURIComponent(u)}`,
    extract: (resp) => {
      // resp può essere { url } o { mp3: { url } } o { result: { url } } ecc.
      if (!resp) return null;
      if (typeof resp === 'string') return resp;
      return resp.url || resp.mp3?.url || resp.mp4?.url || resp.result?.url || resp.result?.download?.url || resp.download?.url || resp.data?.url || null;
    }
  },
  {
    name: 'akuari',
    audio: (u) => `https://api.akuari.my.id/downloader/yt1?link=${encodeURIComponent(u)}`,
    video: (u) => `https://api.akuari.my.id/downloader/yt1?link=${encodeURIComponent(u)}`,
    extract: (resp) => resp?.mp3?.url || resp?.mp4?.url || resp?.url || resp?.data?.url || null
  },
  {
    name: 'another-fallback',
    audio: (u) => `https://api.sometest.my.id/ytmp3?url=${encodeURIComponent(u)}`,
    video: (u) => `https://api.sometest.my.id/ytmp4?url=${encodeURIComponent(u)}`,
    extract: (resp) => resp?.url || resp?.result?.url || null
  }
];

// helper: prova a ottenere il link usando le API in lista (se audio=true usa la property audio)
async function tryApisFor(url, type = 'audio') {
  for (const api of FALLBACK_APIS) {
    const endpoint = (type === 'audio' ? api.audio : api.video)(url);
    try {
      console.log(`[DTH-BOT] Provo API ${api.name} su ${endpoint}`);
      const res = await axios.get(endpoint, { timeout: REQUEST_TIMEOUT, responseType: 'json' });
      // alcune API ritornano direttamente { url: '...' }, altre { mp3: { url: '...' } }
      const extracted = api.extract(res.data);
      if (extracted) {
        console.log(`[DTH-BOT] API ${api.name} ha restituito link: ${extracted}`);
        return { url: extracted, api: api.name, raw: res.data };
      } else {
        console.warn(`[DTH-BOT] API ${api.name} risposta senza link utile.`, res.data);
      }
    } catch (e) {
      console.warn(`[DTH-BOT] Errore chiamata API ${api.name}:`, e.message || e);
    }
  }
  return null;
}

function formatNumber(n) {
  try { return new Intl.NumberFormat().format(n); } catch { return String(n); }
}

const handler = async (m, { conn, text = '', usedPrefix = '.', command }) => {
  try {
    if (!text || !text.trim()) {
      return await conn.sendMessage(m.chat, {
        text: `╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Inserisci un titolo o un link YouTube*\n╰━━━━━━━━━━┈·๏`,
        contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363259442839354@newsletter',
            serverMessageId: '',
            newsletterName: 'DTH-BOT'
          }
        }
      }, { quoted: m });
    }

    // ricerca su yt
    const search = await yts(text).catch(e => {
      console.error('[DTH-BOT] Errore yts:', e);
      return null;
    });
    if (!search || !search.all || !search.all.length) {
      return await conn.sendMessage(m.chat, {
        text: '╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Nessun risultato trovato*\n╰━━━━━━━━━━┈·๏',
        contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363259442839354@newsletter',
            serverMessageId: '',
            newsletterName: 'DTH-BOT'
          }
        }
      }, { quoted: m });
    }

    const videoInfo = search.all[0];
    const { url, title, thumbnail, timestamp, views, ago, author } = videoInfo;
    const durationInSeconds = videoInfo.seconds || 0;

    // se video troppo lungo
    if (durationInSeconds > MAX_DURATION && (command === 'play' || command === 'play2')) {
      return await conn.sendMessage(m.chat, {
        text: `╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Video troppo lungo!*\n┃◈ La durata massima consentita è 5 minuti\n┃◈ Durata attuale: ${timestamp}\n╰━━━━━━━━━━┈·๏`,
        contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363259442839354@newsletter',
            serverMessageId: '',
            newsletterName: 'DTH-BOT'
          }
        }
      }, { quoted: m });
    }

    // se comando play -> mostra info + bottoni
    if (command === 'play') {
      const thumb = (await conn.getFile(thumbnail).catch(() => ({})))?.data;
      const infoMessage = `
╭〔*🎥 INFO VIDEO*〕┈⊷
┃• ✍️ Titolo: ${title}
┃• ⏳ Durata: ${timestamp || 'Sconosciuta'}
┃• 👀 Visualizzazioni: ${formatNumber(views || 0)}
┃• 🔰 Canale: ${author?.name || 'Sconosciuto'}
┃• 🔗 Link: ${url}
╰━━━━━━━━━┈·๏
`;
      return await conn.sendMessage(m.chat, {
        text: infoMessage,
        footer: 'Scegli un formato:',
        buttons: [
          { buttonId: `${usedPrefix}playaudio ${url}`, buttonText: { displayText: "🎵 Scarica Audio" }, type: 1 },
          { buttonId: `${usedPrefix}playvideo ${url}`, buttonText: { displayText: "🎬 Scarica Video" }, type: 1 },
          { buttonId: `${usedPrefix}salva ${url}`, buttonText: { displayText: "💾 Salva" }, type: 1 }
        ],
        viewOnce: true,
        headerType: 4,
        contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363259442839354@newsletter',
            serverMessageId: '',
            newsletterName: 'DTH-BOT'
          },
          externalAdReply: {
            mediaType: 1,
            previewType: 0,
            mediaUrl: url,
            sourceUrl: url,
            thumbnail: thumb,
          }
        }
      }, { quoted: m });
    }

    // handler per playaudio / playvideo (riceve sia link sia titolo)
    if (command === 'playaudio' || command === 'playvideo') {
      // supporta sia l'inserimento di url che di testo (titolo)
      let targetUrl = url;
      if (!/^https?:\/\//i.test(text)) {
        // se l'utente ha messo titolo, usiamo videoInfo.url
        targetUrl = videoInfo.url || targetUrl;
      } else {
        targetUrl = text.trim();
      }

      // messaggio iniziale
      await conn.sendMessage(m.chat, {
        text: (command === 'playaudio') ? '🎵 Preparazione download audio...' : '🎬 Preparazione download video...'
      }, { quoted: m });

      // provo le API a cascata
      const type = (command === 'playaudio') ? 'audio' : 'video';
      const result = await tryApisFor(targetUrl, type);

      if (!result || !result.url) {
        console.error('[DTH-BOT] Nessuna API ha fornito un link. Ultimo videoInfo:', videoInfo);
        return await conn.sendMessage(m.chat, {
          text: '╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Errore interno, riprova più tardi*\n┃◈ Nessuna API disponibile per il download ora\n╰━━━━━━━━━━┈·๏',
          contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363259442839354@newsletter',
              serverMessageId: '',
              newsletterName: 'DTH-BOT'
            }
          }
        }, { quoted: m });
      }

      // controlli addizionali: evita url troppo grandi / non raggiungibili
      const downloadUrl = result.url;
      // opzionale: puoi effettuare HEAD per verificare content-type/size (qui fallo con timeout breve)
      try {
        const head = await axios.head(downloadUrl, { timeout: 8000 }).catch(() => null);
        if (head && head.headers) {
          const ctype = head.headers['content-type'] || '';
          const clen = head.headers['content-length'] ? parseInt(head.headers['content-length']) : null;
          console.log(`[DTH-BOT] HEAD: content-type=${ctype} content-length=${clen}`);
          // se è audio e content-type non audio, warning ma non blocchiamo
        }
      } catch (e) {
        console.warn('[DTH-BOT] HEAD fallita per il downloadUrl:', e.message || e);
      }

      // invio file (WhatsApp può scaricarlo dal link)
      if (command === 'playaudio') {
        await conn.sendMessage(m.chat, {
          audio: { url: downloadUrl },
          mimetype: 'audio/mpeg',
          fileName: `${title}.mp3`,
          contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363259442839354@newsletter',
              serverMessageId: '',
              newsletterName: 'DTH-BOT'
            }
          }
        }, { quoted: m });
        return;
      } else {
        // playvideo
        const thumb = (await conn.getFile(thumbnail).catch(() => ({})))?.data;
        await conn.sendMessage(m.chat, {
          video: { url: downloadUrl },
          caption: `✅ *Download completato!*\n${title}`,
          fileName: `${title}.mp4`,
          mimetype: 'video/mp4',
          thumbnail: thumb,
          contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363259442839354@newsletter',
              serverMessageId: '',
              newsletterName: 'DTH-BOT'
            }
          }
        }, { quoted: m });
        return;
      }
    }

    // se arrivi qui, comando non gestito -> no-op
  } catch (error) {
    console.error('[DTH-BOT] Errore generico handler:', error);
    try {
      await conn.sendMessage(m.chat, {
        text: error?.message?.startsWith('╭━━') ? error.message : `╭━━〔 ❗ 〕━━┈⊷\n┃◈ *Errore interno, riprova più tardi*\n╰━━━━━━━━━━┈·๏`,
        contextInfo: {
          forwardingScore: 99,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363259442839354@newsletter',
            serverMessageId: '',
            newsletterName: 'DTH-BOT'
          }
        }
      }, { quoted: m });
    } catch (e) {
      console.error('[DTH-BOT] Errore inviando messaggio di errore:', e);
    }
  }
};

handler.command = handler.help = ['play', 'playaudio', 'playvideo', 'ytmp4', 'play2'];
handler.tags = ['downloader'];

export default handler;
