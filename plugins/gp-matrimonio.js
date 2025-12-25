const proposals = {}
const adoptions = {}

let handler = async (m, { conn, command, usedPrefix, participants }) => {
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
        case 'coppie':
            return coppie(m, users, participants)
        case 'toglifiglio':
            return togliFiglio(m, users, usedPrefix)
    }
}

/* ================= 💍 MATRIMONIO ================= */
async function sposa(m, conn, users, usedPrefix) {
    const sender = m.sender
    const target = m.mentionedJid?.[0] || m.quoted?.sender

    if (!target) throw `Usa: ${usedPrefix}sposa @utente`
    if (target === sender) throw 'Non puoi sposarti da solo'
    if (!users[target]) users[target] = {}

    if (users[sender].sposato) throw `Sei già sposato con @${users[sender].coniuge?.split('@')[0] || 'sconosciuto'}`
    if (users[target].sposato) throw `Questa persona è già sposata con @${users[target].coniuge?.split('@')[0] || 'sconosciuto'}`
    if (proposals[sender] || proposals[target])
        throw 'C’è già una proposta in corso'

    proposals[target] = sender
    proposals[sender] = target

    await conn.sendMessage(m.chat, {
        text:
`💍 *PROPOSTA DI MATRIMONIO*

@${sender.split('@')[0]} ha chiesto di sposare @${target.split('@')[0]} 💖

Rispondi con *SI* o *NO*.`,
        mentions: [sender, target]
    })

    setTimeout(() => {
        if (proposals[target]) {
            delete proposals[target]
            delete proposals[sender]
            conn.sendMessage(m.chat, { text: '⏳ Proposta di matrimonio scaduta.' })
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

@${sender.split('@')[0]} ha chiesto di adottare @${target.split('@')[0]} 💖

Rispondi con *SI* o *NO*.`,
        mentions: [sender, target]
    })

    setTimeout(() => {
        if (adoptions[target]) {
            delete adoptions[target]
            conn.sendMessage(m.chat, { text: '⏳ Richiesta di adozione scaduta.' })
        }
    }, 60000)
}

/* ================= 📜 FAMIGLIA ================= */
function famiglia(m, users) {
    const user = users[m.sender]
    let txt = `👨‍👩‍👧 *FAMIGLIA DI @${m.sender.split('@')[0]}*\n\n`
    let mentions = []

    txt += '💑 Coniuge:\n'
    if (user.coniuge) {
        txt += `• @${user.coniuge.split('@')[0]}\n`
        mentions.push(user.coniuge)
    } else txt += 'Nessuno\n'

    txt += '\n👤 Genitori:\n'
    if (user.genitori && user.genitori.length) {
        for (let g of user.genitori) {
            txt += `• @${g.split('@')[0]}\n`
            mentions.push(g)
        }
    } else txt += 'Nessuno\n'

    txt += '\n👶 Figli:\n'
    if (user.figli && user.figli.length) {
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
    if (ex) {
        ex.sposato = false
        ex.coniuge = null
    }

    m.reply('💔 Siete ufficialmente divorziati')
}

/* ================= 🔒 CONFERME TESTO ================= */
handler.before = async (m, { conn }) => {
    if (!m.text) return
    const txt = m.text.toLowerCase().trim()
    const users = global.db.data.users

    /* MATRIMONIO */
    if (proposals[m.sender]) {
        const from = proposals[m.sender]
        const to = m.sender

        if (txt === 'si' || txt === 'sì') {
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

        if (txt === 'no') {
            delete proposals[from]
            delete proposals[to]
            return m.reply('❌ Proposta di matrimonio rifiutata')
        }
    }

    /* ADOZIONE */
    if (adoptions[m.sender]) {
        const from = adoptions[m.sender]
        const to = m.sender

        if (txt === 'si' || txt === 'sì') {
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

        if (txt === 'no') {
            delete adoptions[to]
            return m.reply('❌ Adozione rifiutata')
        }
    }
}

/* ================= 💖 COPPIE ================= */
function coppie(m, users, participants) {
    let txt = '💖 *COPPIE SPOSATE NEL GRUPPO*\n\n'
    let found = false
    const mentions = []

    for (let userId of participants.map(p => p.id)) {
        const user = users[userId]
        if (user && user.sposato && user.coniuge && participants.find(p => p.id === user.coniuge)) {
            if (mentions.includes(user.coniuge) || mentions.includes(userId)) continue
            txt += `• @${userId.split('@')[0]} + @${user.coniuge.split('@')[0]}\n`
            mentions.push(userId)
            mentions.push(user.coniuge)
            found = true
        }
    }

    if (!found) txt += 'Nessuna coppia al momento'
    m.reply(txt, null, { mentions })
}

/* ================= 🧒 TOGLI FIGLIO ================= */
function togliFiglio(m, users, usedPrefix) {
    const sender = m.sender
    const target = m.mentionedJid?.[0] || m.quoted?.sender
    if (!target) throw `Usa: ${usedPrefix}toglifiglio @utente`
    if (!users[sender] || !users[sender].figli || !users[sender].figli.includes(target))
        throw 'Non hai questo figlio'

    users[sender].figli = users[sender].figli.filter(f => f !== target)
    if (users[target].genitori)
        users[target].genitori = users[target].genitori.filter(g => g !== sender)

    m.reply(`🧒 @${target.split('@')[0]} è stato rimosso dai tuoi figli`, null, { mentions: [target] })
}

/* ================= COMANDI ================= */
handler.command = ['sposa', 'divorzia', 'adotta', 'famiglia', 'coppie', 'toglifiglio']
handler.group = true

export default handler