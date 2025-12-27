const fs = require('fs')
const folderPath = './database'
const filePath = './database/classifica.json'

// CREAZIONE CARTELLA E FILE SE NON ESISTONO
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
}
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '{}')
}

// FUNZIONI DI LETTURA/SALVATAGGIO
function loadDB() {
    return JSON.parse(fs.readFileSync(filePath))
}
function saveDB(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

module.exports = {
    command: ['classifica'],
    category: 'fun',
    desc: 'Mostra la classifica del gruppo',

    // CONTEGGIO AUTOMATICO DEI MESSAGGI
    async before({ m }) {
        if (!m.isGroup || m.isBot) return

        const db = loadDB()
        const groupId = m.chat
        const userId = m.sender

        if (!db[groupId]) db[groupId] = {}
        if (!db[groupId][userId]) db[groupId][userId] = 0

        db[groupId][userId]++
        saveDB(db)
    },

    // COMANDO .classifica
    async run({ sock, m }) {
        if (!m.isGroup) {
            return sock.sendMessage(m.chat, { text: '❌ Comando solo per gruppi' })
        }

        const db = loadDB()
        const groupId = m.chat

        if (!db[groupId]) {
            return sock.sendMessage(m.chat, { text: '📊 Nessun dato disponibile.' })
        }

        const sorted = Object.entries(db[groupId])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)

        let msg = '🏆 *CLASSIFICA DEL GRUPPO* 🏆\n\n'

        sorted.forEach((u, i) => {
            const medal =
                i === 0 ? '🥇' :
                i === 1 ? '🥈' :
                i === 2 ? '🥉' : `${i + 1}.`

            msg += `${medal} @${u[0].split('@')[0]} — ${u[1]} msg\n`
        })

        await sock.sendMessage(m.chat, {
            text: msg,
            mentions: sorted.map(u => u[0])
        })
    }
}