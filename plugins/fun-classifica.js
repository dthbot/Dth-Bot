module.exports = {
    name: 'classifica', // nome comando
    alias: ['rank'],
    desc: 'Mostra una classifica finta',
    type: 'fun',
    async run({ m, conn }) {
        if (!m.isGroup) return conn.sendMessage(m.chat, { text: '❌ Comando solo per gruppi' })

        const members = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve']
        const scores = members.map(() => Math.floor(Math.random() * 100))

        const sorted = members
            .map((name, i) => ({ name, score: scores[i] }))
            .sort((a, b) => b.score - a.score)

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

        await conn.sendMessage(m.chat, { text: msg })
    }
}