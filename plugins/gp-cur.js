// gp-cur.js — Versione SENZA CANVAS

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const USERS_FILE = path.join(__dirname, '..', 'lastfm_users.json')

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '{}', 'utf8')
}

const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minuti

function loadUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8')
}

function getLastfmUsername(userId) {
  const users = loadUsers()
  return users[userId] || null
}

function setLastfmUsername(userId, username) {
  const users = loadUsers()
  users[userId] = username
  saveUsers(users)
}

const LASTFM_API_KEY = '36f859a1fc4121e7f0e931806507d5f9'

async function fetchWithCache(url) {
  const now = Date.now()
  const cached = cache.get(url)
  if (cached && now - cached.timestamp < CACHE_DURATION) return cached.data

  const res = await fetch(url)
  const json = await res.json()
  cache.set(url, { data: json, timestamp: now })
  return json
}

async function getUserInfo(username) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${username}&api_key=${LASTFM_API_KEY}&format=json`
  const json = await fetchWithCache(url)
  return json?.user
}

async function getTrackInfo(username, artist, track) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&username=${username}&format=json`
  const json = await fetchWithCache(url)
  return json?.track
}

async function getRecentTrack(username) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
  const json = await fetchWithCache(url)
  return json?.recenttracks?.track?.[0]
}

async function getRecentTracks(username, limit = 10) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${LASTFM_API_KEY}&format=json&limit=${limit}`
  const json = await fetchWithCache(url)
  return json?.recenttracks?.track || []
}

const handler = async (m, { conn, args, usedPrefix, text, command }) => {

  // 📌 Comando .setuser
  if (command === 'setuser') {
    const username = text.trim()
    if (!username) {
      return conn.sendMessage(m.chat, { text: `❌ Usa: ${usedPrefix}setuser <username>` })
    }
    setLastfmUsername(m.sender, username)
    return conn.sendMessage(m.chat, { text: `✅ Username *${username}* salvato!` })
  }

  // 🔒 Controllo se l'utente è registrato
  const user = getLastfmUsername(m.sender)
  if (!user) {
    return conn.sendMessage(m.chat, {
      text: `🎵 *Registrazione Last.fm richiesta*\n
@${m.sender.split('@')[0]}, per usare i comandi musicali devi registrare il tuo username.\n
📱 *Usa:* ${usedPrefix}setuser <username>`,
      mentions: [m.sender],
      buttons: [
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: '🌐 Vai su Last.fm',
            url: 'https://last.fm/join'
          })
        }
      ],
      headerType: 1
    })
  }

  // 🎧 Comando .cur
  if (command === 'cur') {
    const track = await getRecentTrack(user)
    if (!track) return conn.sendMessage(m.chat, { text: '❌ Nessuna traccia trovata.' })

    const nowPlaying = track['@attr']?.nowplaying === 'true'
    const artist = track.artist?.['#text'] || 'Artista sconosciuto'
    const title = track.name || 'Brano sconosciuto'
    const album = track.album?.['#text'] || 'Album sconosciuto'
    const image = track.image?.find(img => img.size === 'extralarge')?.['#text'] || null

    const info = await getTrackInfo(user, artist, title)
    const userInfo = await getUserInfo(user)

    const playcountTrack = info?.userplaycount || 0
    const totalScrobbles = userInfo?.playcount || 0

    const caption = `
🎧 *${nowPlaying ? 'In riproduzione' : 'Ultimo brano ascoltato'}* • @${m.sender.split('@')[0]}

🎵 *${title}*
🎤 ${artist}
💿 ${album}

▶️ Ascolti del brano: *${playcountTrack}*
📊 Ascolti totali: *${totalScrobbles}*
    `.trim()

    const ytQuery = encodeURIComponent(`${artist} ${title}`)
    const ytURL = `https://www.youtube.com/results?search_query=${ytQuery}`

    const msg = {
      image: image ? { url: image } : undefined,
      caption,
      mentions: conn.parseMention(caption),
      buttons: [
        { buttonId: `.playaudio ${ytURL}`, buttonText: { displayText: '🎧 Scarica canzone' }, type: 1 },
        { buttonId: `.playvideo ${ytURL}`, buttonText: { displayText: '🎥 Scarica video' }, type: 1 },
      ],
      headerType: 4,
      footer: `.`
    }

    await conn.sendMessage(m.chat, msg, { quoted: m })
    return
  }

  // 📜 Cronologia (solo testo)
  if (command === 'cronologia') {
    const tracks = await getRecentTracks(user, 10)
    if (!tracks.length) return conn.sendMessage(m.chat, { text: '❌ Nessuna cronologia trovata.' })

    const trackList = tracks.map((track, i) => {
      const icon = track['@attr']?.nowplaying === 'true' ? '▶️' : `${i + 1}.`
      return `${icon} *${track.name}*\n   🖌️ ${track.artist['#text']}`
    }).join('\n\n')

    await conn.sendMessage(m.chat, { text: `📜 *Cronologia di ${user}*\n\n${trackList}` })
    return
  }
}

handler.command = ['setuser', 'cur', 'cronologia']
handler.group = true

export default handler
