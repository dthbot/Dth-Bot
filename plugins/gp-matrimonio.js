const proposals = {}
const adoptions = {}

let handler = async (m, { conn, command, usedPrefix }) => {
    const users = global.db.data.users
    if (!users[m.sender]) users[m.sender] = {}

    switch (command) {
        case 'sposa':
            return sposa(m, conn, users, usedPrefix)
        case 'divorzia':
            return divorzia(m, users)
        case 'adotta':
            return adotta(m, conn, users, usedPrefix)
        case 'famiglia':
            return famiglia(m, users)
    }
}

/* ================= 💍 MATRIMONIO ================= */

async function sposa(m, conn, users, usedPrefix) {
    const sender = m.sender
    const target = m.mentionedJid?.[0] || m.quoted?.sender

    if (!target) throw `Usa: ${usedPrefix}sposa @utente`
    if (target === sender) throw 'Non puoi sposarti da solo'
    if (!users[target]) users[target] = {}

    if (users[sender].sposato) throw 'Sei già sposato'
    if (users[target].sposato) throw 'Questa persona è già sposata'
    if (proposals[sender] || proposals[target]) throw 'C’è già una proposta in corso'

    proposals[target] = sender
    proposals[sender] = target

    await conn.sendMessage(m.chat, {
        text:
`💍 *PROPOSTA DI MATRIMONIO*

@${sender.split('@')[0]} vuole sposarti 💖

Accetti?`,
        mentions: [sender, target],
        buttons: [
            { buttonId: 'sposa_si|' + sender, buttonText: { displayText: '💍 SÌ' }, type: 1 },
            { buttonId: 'sposa_no|' + sender, buttonText: { displayText: '❌ NO' }, type: 1 }
        ]
    })

    setTimeout(() => {
        if (proposals[target]) {
            delete proposals[target]
            delete proposals[sender]
            conn.sendMessage(m.chat, { text: '⏳ Proposta scaduta.' })
        }
    }, 60000)
}

/* ================= 👨‍👩‍👧 ADOZIONE ================= */

async function adotta(m, conn, users, usedPrefix) {
    const sender = m.sender
    const target = m.mentionedJid?.[0] || m.quoted?.sender

    if (!target) throw `Usa: ${usedPrefix}adotta @utente`
    if (target === sender) throw 'Non puoi adottare te stesso'
    if (!users[target]) users[target] = {}
    if (users[target].genitori && users[target].genitori.length)
        throw 'Questa persona ha già dei genitori'

    adoptions[target] = sender

    await conn.sendMessage(m.chat, {
        text:
`👨‍👩‍👧 *RICHIESTA DI ADOZIONE*

@${sender.split('@')[0]} vuole adottarti 💖

Accetti?`,
        mentions: [sender, target],
        buttons: [
            { buttonId: 'adotta_si|' + sender, buttonText: { displayText: '✅ SÌ' }, type: 1 },
            { buttonId: 'adotta_no|' + sender, buttonText: { displayText: '❌ NO' }, type: 1 }
        ]
    })

    setTimeout(() => {
        if (adoptions[target]) {
            delete adoptions[target]
            conn.sendMessage(m.chat, { text: '⏳ Adozione scaduta.' })
        }
    }, 60000)
}

/* ================= 📜 FAMIGLIA ================= */

function famiglia(m, users) {
    const user = users[m.sender]
    let txt = `👨‍👩‍👧 *FAMIGLIA DI @${m.sender.split('@')[0]}*\n\n`
    let mentions = []

    txt += '👤 Genitori:\n'
    if (user.genitori?.length) {
        for (let g of user.genitori) {
            txt += `• @${g.split('@')[0]}\n`
            mentions.push(g)
        }
    } else txt += 'Nessuno\n'

    txt += '\n👶 Figli:\n'
    if (user.figli?.length) {
        for (let f of user.figli) {
            txt += `• @${f.split('@')[0]}\n`
            mentions.push(f)
        }
    } else txt += 'Nessuno'

    m.reply(txt, null, { mentions })
}

/* ================= 💔 DIVORZIO ================= */

function divorzia(m, users) {
    const user = users[m.sender]
    if (!user.sposato) throw 'Non sei sposato'

    const ex = users[user.coniuge]
    user.sposato = false
    user.coniuge = null
    ex.sposato = false
    ex.coniuge = null

    m.reply('💔 Siete ufficialmente divorziati')
}

/* ================= 🔘 BOTTONI ================= */

handler.before = async (m, { conn }) => {
    if (!m.buttonId) return

    const users = global.db.data.users
    const [action, from] = m.buttonId.split('|')
    const to = m.sender

    if (action === 'sposa_si') {
        users[from].sposato = true
        users[from].coniuge = to
        users[to].sposato = true
        users[to].coniuge = from

        delete proposals[from]
        delete proposals[to]

        return conn.sendMessage(m.chat, {
            text: `💍 @${from.split('@')[0]} e @${to.split('@')[0]} ora sono sposati!`,
            mentions: [from, to]
        })
    }

    if (action === 'sposa_no') {
        delete proposals[from]
        delete proposals[to]
        return m.reply('❌ Proposta rifiutata')
    }

    if (action === 'adotta_si') {
        users[to].genitori = [from]
        if (!users[from].figli) users[from].figli = []
        users[from].figli.push(to)

        if (users[from].sposato && users[from].coniuge) {
            const partner = users[from].coniuge
            if (!users[partner].figli) users[partner].figli = []
            users[partner].figli.push(to)
            users[to].genitori.push(partner)
        }

        delete adoptions[to]

        return conn.sendMessage(m.chat, {
            text: `👨‍👩‍👧 @${from.split('@')[0]} ha adottato @${to.split('@')[0]}`,
            mentions: [from, to]
        })
    }

    if (action === 'adotta_no') {
        delete adoptions[to]
        return m.reply('❌ Adozione rifiutata')
    }
}

handler.command = ['sposa', 'divorzia', 'adotta', 'famiglia']
handler.group = true

export default handler