// gp-cur.js — Last.fm CUR + SETUSER
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const USERS_FILE = path.join(__dirname, '..', 'lastfm_users.json')

if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}', 'utf8')

// ─── Config ──────────────────────────────
const LASTFM_API_KEY = '36f859a1fc4121e7f0e931806507d5f9'

// ─── Funzioni utenti ─────────────────────
const loadUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
const saveUsers = (u) => fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2))

const getUser = (id) => loadUsers()[id] || null
const setUser = (id, name) => {
  const users = loadUsers()
  users[id] = name
  saveUsers(users)
}

// ─── Funzioni API Last.fm ───────────────
async function fetchNoCache(url) {
  try {
    const res = await fetch(url)
    return await res.json()
  } catch (e) {
    return null
  }
}

async function getRecentTrack(user) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${LASTFM_API_KEY}&format=json&limit=1&_=${Date.now()}`
  const json = await fetchNoCache(url)
  return json?.recenttracks?.track?.[0]
}

async function getTrackInfo(user, artist, track) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&username=${user}&format=json`
  const json = await fetchNoCache(url)
  return json?.track
}

// ─── Funzioni popolarità (Fixata) ──────────
function popularityBar(listeners) {
  const max = 1000000 
  let level = Math.floor((listeners / max) * 10)
  if (listeners > 0 && level === 0) level = 1
  if (level > 10) level = 10
  return '█'.repeat(level) + '░'.repeat(10 - level)
}

function popularityLabel(listeners) {
  if (listeners < 10000) return '🖤 Underground'
  if (listeners < 100000) return '✨ Niche'
  if (listeners < 500000) return '🔥 Popolare'
  return '🌍 HIT'
}

// ─── Handler ────────────────────────────
const handler = async (m, { conn, usedPrefix, command, text }) => {

  // 🔹 SETUSER
  if (command === 'setuser') {
    const username = text.trim()
    if (!username) return m.reply(`❌ Usa: ${usedPrefix}setuser <username>`)
    setUser(m.sender, username)
    return m.reply(`✅ Username Last.fm *${username}* salvato!`)
  }

  // 🔹 CUR
  if (command === 'cur') {
    let targetId = m.mentionedJid?.[0] || m.sender
    const user = getUser(targetId)

    if (!user) {
      return conn.sendMessage(m.chat, {
        text: `❌ L'utente non ha registrato un username Last.fm.\nUsa: ${usedPrefix}setuser <username>`,
        mentions: [targetId]
      })
    }

    const track = await getRecentTrack(user)
    if (!track) return m.reply('❌ Nessuna traccia trovata.')

    const artist = track.artist['#text']
    const title = track.name
    const album = track.album?.['#text'] || '—'
    const image = track.image?.find(i => i.size === 'extralarge')?.['#text']

    const info = await getTrackInfo(user, artist, title)

    // Fix Popolarità: gestione corretta dei dati numerici
    const listeners = parseInt(info?.listeners || 0)
    const playcount = parseInt(info?.userplaycount || 0)
    const durationMs = parseInt(info?.duration || 0)
    const minutes = durationMs ? Math.round((playcount * durationMs) / 60000) : 0

    const tags = info?.toptags?.tag
      ?.slice(0, 4)
      .map(t => `#${t.name}`)
      .join(' ') || '—'

    const displayName = '@' + targetId.split('@')[0]

    const caption = `
🎧 *In riproduzione di ${displayName}*

🎵 *${title}*
🎤 ${artist}
💿 ${album}

⏱️ Minuti ascoltati da te: *${minutes}*
🎨 Mood: ${tags}

🔥 Popolarità: ${popularityBar(listeners)}
📊 Listener totali: *${listeners.toLocaleString()}*
🏷️ Stato: *${popularityLabel(listeners)}*
`.trim()

    return conn.sendMessage(m.chat, {
      image: image ? { url: image } : undefined,
      caption,
      mentions: [targetId]
    }, { quoted: m })
  }
}

handler.command = ['cur', 'setuser']
handler.group = true

export default handler
