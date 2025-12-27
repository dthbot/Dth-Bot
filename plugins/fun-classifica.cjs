module.exports = {
    command: ['classifica'],
    category: 'fun',
    desc: 'Mostra una classifica finta del gruppo con grafica',

    before: async function({ m }) {
        // niente da fare
    },

    run: async function({ sock, m }) {
        if (!m || !m.isGroup) return sock.sendMessage(m.chat, { text: '❌ Comando solo per gruppi' })

        // Membri finti e punteggi casuali
        const members = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']
        const scores = members.map(() => Math.floor(Math.random() * 100))

        const sorted = members
            .map((name, i) => ({ name, score: scores[i] }))
            .sort((a, b) => b.score - a.score)

        // Costruzione del messaggio con linee e font Unicode
        let msg = '═══════════════════\n'
        msg += '🏆 𝐂𝐋𝐀𝐒𝐒𝐈𝐅𝐈𝐂𝐀 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐏𝐎 🏆\n'
        msg += '═══════════════════\n\n'

        sorted.forEach((u, i) => {
            const medal =
                i === 0 ? '🥇' :
                i === 1 ? '🥈' :
                i === 2 ? '🥉' : `#${i + 1}`

            msg += `✦ ${medal}  𝑵𝒐𝒎𝒆: ${u.name} — 𝑷𝒖𝒏𝒕𝒊: ${u.score}\n`
            msg += '───────────────────\n'
        })

        msg += '\n🎉 Complimenti ai partecipanti! 🎉'

        await sock.sendMessage(m.chat, { text: msg })
    }
}