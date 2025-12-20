import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// __dirname per ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// percorso database sicuro
const DB_DIR = path.join(__dirname, "../database")
const DB_PATH = path.join(DB_DIR, "warns.json")

const MAX_WARNS = 3

// crea cartella database se non esiste
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
}

// crea file se non esiste
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({}))
}

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH))
const saveDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))

export default {
    name: "warn",
    alias: ["unwarn", "delwarn", "listwarn"],
    category: "moderation",
    desc: "Sistema warn con kick automatico",
    async exec({ sock, m, command, isAdmin, isBotAdmin }) {

        if (!m.isGroup)
            return m.reply(
`╭─❌ *ERRORE*
│ Questo comando funziona solo nei gruppi
╰────────────`
            )

        if (!isAdmin)
            return m.reply(
`╭─🚫 *PERMESSI*
│ Solo gli admin possono usare questo comando
╰────────────`
            )

        if (!isBotAdmin)
            return m.reply(
`╭─🤖 *BOT NON ADMIN*
│ Devo essere admin per gestire i warn
╰────────────`
            )

        const db = getDB()

        /* ───── LISTWARN ───── */
        if (command === "listwarn") {
            const users = Object.keys(db).filter(u => db[u] > 0)

            if (users.length === 0) {
                return m.reply(
`╭─📭 *LISTA WARN*
│ Nessun utente ha warn
╰────────────`
                )
            }

            let text = `╭─📋 *LISTA WARN ATTIVI*\n`
            for (let u of users) {
                text += `│ 👤 @${u.split("@")[0]} → ⚠️ ${db[u]}/${MAX_WARNS}\n`
            }
            text += `╰────────────`

            return m.reply(text, { mentions: users })
        }

        const user = m.mentionedJid?.[0]
        if (!user)
            return m.reply(
`╭─⚠️ *USO CORRETTO*
│ Tagga un utente
│ .${command} @user
╰────────────`
            )

        if (!db[user]) db[user] = 0

        /* ───── WARN ───── */
        if (command === "warn") {
            db[user]++
            saveDB(db)

            if (db[user] >= MAX_WARNS) {
                await sock.groupParticipantsUpdate(
                    m.chat,
                    [user],
                    "remove"
                )

                db[user] = 0
                saveDB(db)

                return m.reply(
`╭─🚨 *LIMITE WARN RAGGIUNTO*
│ 👤 Utente: @${user.split("@")[0]}
│ ⚠️ Warn: ${MAX_WARNS}/${MAX_WARNS}
│ 🔨 Azione: *KICK*
╰────────────`,
                    { mentions: [user] }
                )
            }

            return m.reply(
`╭─⚠️ *WARN AGGIUNTO*
│ 👤 Utente: @${user.split("@")[0]}
│ 📊 Warn: ${db[user]}/${MAX_WARNS}
╰────────────`,
                { mentions: [user] }
            )
        }

        /* ───── UNWARN ───── */
        if (command === "unwarn") {
            if (db[user] > 0) db[user]--
            saveDB(db)

            return m.reply(
`╭─✅ *WARN RIMOSSO*
│ 👤 Utente: @${user.split("@")[0]}
│ 📊 Warn rimasti: ${db[user]}/${MAX_WARNS}
╰────────────`,
                { mentions: [user] }
            )
        }

        /* ───── DELWARN ───── */
        if (command === "delwarn") {
            db[user] = 0
            saveDB(db)

            return m.reply(
`╭─🗑️ *WARN AZZERATI*
│ 👤 Utente: @${user.split("@")[0]}
│ 📊 Warn: 0/${MAX_WARNS}
╰────────────`,
                { mentions: [user] }
            )
        }
    }
                }
