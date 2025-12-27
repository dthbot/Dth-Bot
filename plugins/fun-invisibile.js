export const invisible = {
    name: 'invisible',
    alias: ['ghost'],
    desc: 'Rende un utente invisibile nel gruppo 👻',
    type: 'fun',

    async run({ m, conn }) {
        if (!m.isGroup) return conn.sendMessage(m.chat, { text: '❌ Comando solo per gruppi' })
        if (!m.mentionedJid || m.mentionedJid.length === 0)
            return conn.sendMessage(m.chat, { text: '⚠️ Devi menzionare qualcuno!\nEsempio: .invisible @utente' })

        const userTag = m.mentionedJid[0].split('@')[0]
        await conn.sendMessage(m.chat, { text: `👻 Shh! ${userTag} è diventato invisibile… Non puoi vederlo!` })
    }
}