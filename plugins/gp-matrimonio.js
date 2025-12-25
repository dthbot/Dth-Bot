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
    const user = users[sender]

    const target = m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : null

    if (!target)
        throw 'Usa: ' + usedPrefix + 'sposa @utente'
    if (target === sender)
        throw 'Non puoi sposarti da solo'

    if (!users[target]) users[target] = {}

    if (user.sposato) throw 'Sei già sposato'
    if (users[target].sposato) throw 'Questa persona è già sposata'
    if (proposals[sender] || proposals[target])
        throw 'C’è già una proposta in corso'

    proposals[target] = { from: sender }
    proposals[sender] = { to: target }

    await conn.sendMessage(m.chat, {
        interactiveMessage: {
            header: { title: '💍 PROPOSTA DI MATRIMONIO' },
            body: {
                text:
'@' + sender.split('@')[0] + ' vuole sposarti 💖\n\nAccetti la proposta?'
            },
            footer: { text: 'Hai 60 secondi per rispondere' },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: '💍 SÌ',
                            id: 'sposa_si|' + sender
                        })
                    },
                    {
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: '❌ NO',
                            id: 'sposa_no|' + sender
                        })
                    }
                ]
            }
        },
        mentions: [sender, target]
    })

    setTimeout(() => {
        if (proposals[target]) {
            delete proposals[target]
            delete proposals[sender]
            conn.sendMessage(m.chat, {
                text: '⏳ Proposta di matrimonio scaduta.'
            })
        }
    }, 60000)
}

/* ================= 👨‍👩‍👧 ADOZIONE ================= */

async function adotta(m, conn, users, usedPrefix) {
    const sender = m.sender
    const target = m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.quoted
        ? m.quoted.sender
        : null

    if (!target)
        throw 'Usa: ' + usedPrefix + 'adotta @utente'
    if (target === sender)
        throw 'Non puoi adottare te stesso'

    if (!users[target]) users[target] = {}

    if (users[target].genitori && users[target].genitori.length)
        throw 'Questa persona ha già dei genitori'

    adoptions[target] = { from: sender }

    await conn.sendMessage(m.chat, {
        interactiveMessage: {
            header: { title: '👨‍👩‍👧 RICHIESTA DI ADOZIONE' },
            body: {
                text:
'@' + sender.split('@')[0] + ' vuole adottarti 💖\n\nAccetti di entrare nella sua famiglia?'
            },
            footer: { text: 'Hai 60 secondi per rispondere' },
            nativeFlowMessage: {
                buttons: [
                    {
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: '✅ SÌ',
                            id: 'adotta_si|' + sender
                        })
                    },
                    {
                        name: 'quick_reply',
                        buttonParamsJson: JSON.stringify({
                            display_text: '❌ NO',
                            id: 'adotta_no|' + sender
                        })
                    }
                ]
            }
        },
        mentions: [sender, target]
    })

    setTimeout(() => {
        if (adoptions[target]) {
            delete adoptions[target]
            conn.sendMessage(m.chat, {
                text: '⏳ Richiesta di adozione scaduta.'
            })
        }
    }, 60000)
}

/* ================= 📜 FAMIGLIA ================= */

function famiglia(m, users) {
    const user = users[m.sender]
    let text = '👨‍👩‍👧 *FAMIGLIA DI @' + m.sender.split('@')[0] + '*\n\n'
    let mentions = []

    text += '👤 *Genitori:*\n'
    if (user.genitori && user.genitori.length) {
        for (let i = 0; i < user.genitori.length; i++) {
            let g = user.genitori[i]
            text += '• @' + g.split('@')[0] + '\n'
            mentions.push(g)
        }
    } else text += 'Nessuno\n'

    text += '\n👶 *Figli:*\n'
    if (user.figli && user.figli.length) {
        for (let i = 0; i < user.figli.length; i++) {
            let f = user.figli[i]
            text += '• @' + f.split('@')[0] + '\n'
            mentions.push(f)
        }
    } else text += 'Nessuno'

    m.reply(text, null, { mentions: mentions })
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

/* ================= 🔘 RISPOSTE BOTTONI ================= */

handler.before = async (m, { conn }) => {
    if (!m.message || !m.message.interactiveResponseMessage) return

    const response =
        m.message.interactiveResponseMessage
            .nativeFlowResponseMessage
    if (!response) return

    const params = JSON.parse(response.paramsJson)
    if (!params || !params.id) return

    const users = global.db.data.users
    const data = params.id.split('|')
    const action = data[0]
    const from = data[1]
    const to = m.sender

    /* MATRIMONIO */
    if (action === 'sposa_si') {
        users[from].sposato = true
        users[from].coniuge = to
        users[to].sposato = true
        users[to].coniuge = from

        if (!users[from].figli) users[from].figli = []
        if (!users[to].figli) users[to].figli = []

        for (let i = 0; i < users[from].figli.length; i++) {
            let f = users[from].figli[i]
            if (users[to].figli.indexOf(f) === -1) {
                users[to].figli.push(f)
                if (!users[f].genitori) users[f].genitori = []
                if (users[f].genitori.indexOf(to) === -1)
                    users[f].genitori.push(to)
            }
        }

        delete proposals[from]
        delete proposals[to]

        return conn.sendMessage(m.chat, {
            text:
'💍 @' + from.split('@')[0] + ' e @' + to.split('@')[0] + ' ora sono sposati!',
            mentions: [from, to]
        })
    }

    if (action === 'sposa_no') {
        delete proposals[from]
        delete proposals[to]
        return m.reply('❌ Proposta rifiutata')
    }

    /* ADOZIONE */
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
            text:
'👨‍👩‍👧 @' + from.split('@')[0] + ' ha adottato @' + to.split('@')[0],
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