// gp-cur.js — Last.fm CUR + SETUSER (Fixed Mood & Popularity)
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const USERS_FILE = path.join(__dirname, '..', 'lastfm_users.json')

if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}', 'utf8')

const LASTFM_API_KEY = '36f859a1fc4121e7f0e931806507d5f9'

const loadUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
const saveUsers = (u) => fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2))
const getUser = (id) => loadUsers()[id] || null
const setUser = (id, name) => {
  const users = loadUsers()
  users[id] = name
  saveUsers(users)
}

async function fetchNoCache(url) {
  try {
    const res = await fetch(url)
    return await res.json()
  } catch { return null }
}

// Ottiene l'ultima traccia ascoltata
async function getRecentTrack(user) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
  const json = await fetchNoCache(url)
  return json?.recenttracks?.track?.[0]
}

// Ottiene info dettagliate (Tags, Listeners, User Playcount)
async function getTrackInfo(user, artist, track) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&username=${user}&format=json`
  const json = await fetchNoCache(url)
  return json?.track
}

// Fallback per i tag se la traccia non ne ha
async function getArtistInfo(artist) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&format=json`
  const json = await fetchNoCache(url)
  return json?.artist
}

function popularityBar(listeners) {
  const max = 2000000 // Soglia per HIT mondiale
  let level = Math.min(10, Math.max(1, Math.round((listeners / max) * 10)))
  if (listeners === 0) level = 0
  return '█'.repeat(level) + '░'.repeat(10 - level)
}

function popularityLabel(listeners) {
  if (listeners < 15000) return '🖤 Underground'
  if (listeners < 150000) return '✨ Niche'
  if (listeners < 600000) return '🔥 Popolare'
  return '🌍 HIT'
}

const handler = async (m, { conn, usedPrefix, command, text }) => {

  if (command === 'setuser') {
    const username = text.trim()
    if (!username) return m.reply(`❌ Usa: ${usedPrefix}setuser <username>`)
    setUser(m.sender, username)
    return m.reply(`✅ Username Last.fm *${username}* salvato!`)
  }

  if (command === 'cur') {
    let targetId = m.mentionedJid?.[0] || m.sender
    const user = getUser(targetId)

    if (!user) return conn.sendMessage(m.chat, { text: `❌ Registrati con ${usedPrefix}setuser <username>`, mentions: [targetId] })

    const track = await getRecentTrack(user)
    if (!track) return m.reply('❌ Nessun ascolto trovato.')

    const artistName = track.artist['#text']
    const trackName = track.name
    const album = track.album?.['#text'] || '—'
    const image = track.image?.find(i => i.size === 'extralarge')?.['#text']

    const info = await getTrackInfo(user, artistName, trackName)
    
    // Gestione Tag (Mood) con fallback sull'artista
    let tagsArr = info?.toptags?.tag || []
    if (tagsArr.length === 0) {
        const artistInfo = await getArtistInfo(artistName)
        tagsArr = artistInfo?.tags?.tag || []
    }
    const tags = tagsArr.slice(0, 4).map(t => `#${t.name.toLowerCase()}`).join(' ') || '#music'

    const listeners = parseInt(info?.listeners || 0)
    const playcount = parseInt(info?.userplaycount || 0)
    const durationMs = parseInt(info?.duration || 0)
    const minutes = durationMs ? Math.round((playcount * durationMs) / 60000) : '—'

    const displayName = '@' + targetId.split('@')[0]

    const caption = `
🎧 *In riproduzione di ${displayName}*

🎵 *${trackName}*
🎤 ${artistName}
💿 ${album}

⏱️ Minuti totali ascoltati: *${minutes}*
🎨 Mood: ${tags}

🔥 Popolarità: ${popularityBar(listeners)}
📊 Listener: *${listeners.toLocaleString()}*
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
      
