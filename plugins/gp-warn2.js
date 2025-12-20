import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_DIR = path.join(__dirname, "../database")
const DB_PATH = path.join(DB_DIR, "warns.json")
const MAX_WARNS = 3

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}))

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH))
const saveDB = (d) => fs.writeFileSync(DB_PATH, JSON.stringify(d, null, 2))

export default {
    name: "warn",
    alias: ["unwarn", "delwarn", "listwarn"],
    category: "moderation",
    async exec({ sock, m, command, isAdmin, isBotAdmin }) {

        const jid = m.key.remoteJid   // 🔥 QUESTO È IL FIX

        const send = (text, mentions = []) => {
            return sock.sendMessage(jid, { text, mentions })
        }

        if (!m.isGroup)
            return send(
`╭─❌ *ERRORE*
│ Solo nei gruppi
╰────────────`
            )

        if (!isAdmin)
            return send(
`╭─🚫 *PERMESSI*
│ Solo admin
╰────────────`
            )

        if (!isBotAdmin)
            return send(
`╭─🤖 *BOT NON ADMIN*
│ Devo essere admin
╰────────────`
            )

        const db = getDB()

        /* ───── LISTWARN ───── */
        if (command === "listwarn") {
            const users = Object.keys(db).filter(u => db[u] > 0)

            if (users.length === 0)
                return send(
`╭─📭 *LISTA WARN*
│ Nessun warn
╰────────────`
                )

            let txt = `╭─📋 *LISTA WARN*\n`
            for (let u of users) {
                txt += `│ 👤 @${u.split("@")[0]} → ⚠️ ${db[u]}/${MAX_WARNS}\n`
            }
            txt += `╰────────────`

            return send(txt, users)
        }

        const user = m.mentionedJid?.[0]
        if (!user)
            return send(
`╭─⚠️ *USO*
│ .${command} @user
╰────────────`
            )

        if (!db[user]) db[user] = 0

        /* ───── WARN ───── */
        if (command === "warn") {
            db[user]++
            saveDB(db)

            if (db[user] >= MAX_WARNS) {
                await sock.groupParticipantsUpdate(jid, [user], "remove")
                db[user] = 0
                saveDB(db)

                return send(
`╭─🚨 *KICK*
│ @${user.split("@")[0]}
│ Warn ${MAX_WARNS}/${MAX_WARNS}
╰────────────`,
                [user])
            }

            return send(
`╭─⚠️ *WARN*
│ @${user.split("@")[0]}
│ ${db[user]}/${MAX_WARNS}
╰────────────`,
            [user])
        }

        /* ───── UNWARN ───── */
        if (command === "unwarn") {
            if (db[user] > 0) db[user]--
            saveDB(db)

            return send(
`╭─✅ *UNWARN*
│ @${user.split("@")[0]}
│ ${db[user]}/${MAX_WARNS}
╰────────────`,
            [user])
        }

        /* ───── DELWARN ───── */
        if (command === "delwarn") {
            db[user] = 0
            saveDB(db)

            return send(
`╭─🗑️ *RESET WARN*
│ @${user.split("@")[0]}
╰────────────`,
            [user])
        }
    }
                                                 }
