// gp-cur.js — Last.fm CUR + SETUSER (Mood & Popularity + Buttons)
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
  } catch {
    return null
  }
}

async function getRecentTrack(user) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${LASTFM_API_KEY}&format=json&limit=1`
  const json = await fetchNoCache(url)
  return json?.recenttracks?.track?.[0]
}

async function getTrackInfo(user, artist, track) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&username=${user}&format=json`
  const json = await fetchNoCache(url)
  return json?.track
}

async function getArtistInfo(artist) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&format=json`
  const json = await fetchNoCache(url)
  return json?.artist
}

function popularityBar(listeners) {
  const max = 2000000
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
    const targetId = m.mentionedJid?.[0] || m.sender
    const user = getUser(targetId)

    if (!user)
      return conn.sendMessage(m.chat, {
        text: `❌ Registrati con ${usedPrefix}setuser <username>`,
        mentions: [targetId]
      })

    const track = await getRecentTrack(user)
    if (!track) return m.reply('❌ Nessun ascolto trovato.')

    const artistName = track.artist['#text']
    const trackName = track.name
    const album = track.album?.['#text'] || '—'
    const image = track.image?.find(i => i.size === 'extralarge')?.['#text']

    const info = await getTrackInfo(user, artistName, trackName)

    let tagsArr = info?.toptags?.tag || []
    if (!tagsArr.length) {
      const artistInfo = await getArtistInfo(artistName)
      tagsArr = artistInfo?.tags?.tag || []
    }

    const tags =
      tagsArr.slice(0, 4).map(t => `#${t.name.toLowerCase()}`).join(' ') || '#music'

    const listeners = parseInt(info?.listeners || 0)
    const playcount = parseInt(info?.userplaycount || 0)
    const durationMs = parseInt(info?.duration || 0)
    const minutes = durationMs
      ? Math.round((playcount * durationMs) / 60000)
      : '—'

    const displayName = '@' + targetId.split('@')[0]

    const caption = `
🎧 𝐕𝐞𝐝𝐢𝐚𝐦𝐨 𝐜𝐨𝐬𝐚 𝐚𝐬𝐜𝐨𝐥𝐭𝐚 ${displayName}

🎵 *${trackName}*
🎤 ${artistName}
💿 ${album}

⏱️ 𝐌𝐢𝐧𝐮𝐭𝐢 𝐚𝐬𝐜𝐨𝐥𝐭𝐚𝐭𝐢: *${minutes}*
🎨 𝐌𝐨𝐨𝐝: ${tags}

🔥 𝐏𝐨𝐩𝐨𝐥𝐚𝐫𝐢𝐭à: ${popularityBar(listeners)}
📊 𝐋𝐢𝐬𝐭𝐞𝐧𝐞𝐫: *${listeners.toLocaleString()}*
🏷️ 𝐒𝐭𝐚𝐭𝐨: *${popularityLabel(listeners)}*
`.trim()

    const buttons = [
      {
        buttonId: `like_${trackName}`,
        buttonText: { displayText: '👍 Ti piace?' },
        type: 1
      },
      {
        buttonId: `dislike_${trackName}`,
        buttonText: { displayText: '👎 Non ti piace?' },
        type: 1
      }
    ]

    return conn.sendMessage(m.chat, {
      image: image ? { url: image } : undefined,
      caption,
      footer: `Last.fm di ${user}`,
      buttons,
      headerType: image ? 4 : 1,
      mentions: [targetId]
    }, { quoted: m })
  }
}

handler.command = ['cur', 'setuser']
handler.group = true

export default handler