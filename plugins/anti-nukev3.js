/*
  =============================================================
  Modulo AntiNuke V3 - Protezione Aggressiva Istantanea
  Obiettivo: Intercettare e bloccare gli admin malintenzionati 
             prima che possano completare la rimozione di massa.
             NUOVA LOGICA: Declassamento di MASSA degli amministratori.
  =============================================================
*/

/**
 * @param {import('@whiskeysockets/baileys').WASocket} conn
 * @param {import('@whiskeysockets/baileys').WA_Events['group-participants.update']} m
 * @param {Object} options
 * @param {Function} options.isBotAdmin
 * @param {Function} options.isOwner
 */
async function onParticipantsUpdate(conn, m, { isBotAdmin, isOwner }) {
  // --- GUARDIE DI SICUREZZA ESSENZIALI ---
  // Se non ci sono dati, non è un gruppo, o il bot non è admin, non fare nulla.
  if (!m || !m.chat || !m.action || !isBotAdmin) return
  
  const chat = global.db.data.chats[m.chat]
  // Se l'antinuke non è attivo per questa chat, non fare nulla.
  if (!chat || !chat.antiNuke) return

  // --- LOGICA ANTI-NUKE (SOLO PER RIMOZIONI) ---
  if (m.action !== 'remove') return

  const perpetrator = m.author // L'admin che sta eseguendo l'azione
  
  if (!perpetrator) {
    console.log('[AntiNuke] Azione di rimozione senza autore, impossibile intervenire.')
    return
  }

  const metadata = await conn.groupMetadata(m.chat).catch(() => null)
  if (!metadata) return
  
  // Identifica il Proprietario del Gruppo
  const groupOwner = metadata.owner || metadata.participants.find(p => p.admin === 'superadmin')?.id

  // --- CONTROLLI DI IMMUNITÀ (Se l'attaccante è immune, usciamo) ---
  // 1. Il Proprietario del Bot (tu) ha immunità totale.
  if (isOwner(perpetrator)) {
    console.log(`[AntiNuke] Azione consentita: eseguita dal Proprietario del Bot (${perpetrator.split('@')[0]}).`)
    return
  }

  // 2. Il Proprietario del Gruppo ha immunità.
  if (perpetrator === groupOwner) {
    console.log(`[AntiNuke] Azione consentita: eseguita dal Proprietario del Gruppo (${perpetrator.split('@')[0]}).`)
    return
  }

  // --- LOGICA DI BLOCCO AGGRESSIVO ---

  const removedCount = m.participants.length
  
  // SOGLIA DI ATTACCO: Rimuovere più di 1 persona è considerato un attacco.
  if (removedCount > 1) {
    console.warn(`[AntiNuke] ATTACCO NUKE RILEVATO!`)
    console.warn(`  > Gruppo: ${metadata.subject} (${m.chat})`)
    console.warn(`  > Admin Malintenzionato: ${perpetrator.split('@')[0]}`)
    console.warn(`  > Utenti Rimossi: ${removedCount}`)

    try {
      // 1. Trova tutti gli admin attuali nel gruppo
      const allAdmins = metadata.participants
        .filter(p => p.admin !== null && p.admin !== undefined)
        .map(p => p.id)
        
      // 2. Filtra gli admin da declassare: tutti tranne Bot Owner, Group Owner, e il Bot stesso
      const adminsToDemote = allAdmins.filter(adminId => {
        const isImmune = isOwner(adminId) || adminId === groupOwner || adminId === conn.user.id;
        return !isImmune;
      });

      if (adminsToDemote.length > 0) {
        // --- CONTRATTACCO MASSIVO ---
        
        // Declassa tutti gli admin non immuni (l'attaccante è sicuramente incluso)
        await conn.groupParticipantsUpdate(m.chat, adminsToDemote, 'demote')
        
        // RECUPERO: Prova a riaggiungere gli utenti rimossi.
        await conn.groupParticipantsUpdate(m.chat, m.participants, 'add')

        // RAPPORTO: Invia un messaggio di avviso
        await conn.sendMessage(m.chat, {
          text: `*[🚨 ANTI-NUKE MASSIVO ATTIVATO] Rilevato tentativo di rimozione di massa!*
Ho neutralizzato l'attacco declassando *tutti gli amministratori* (${adminsToDemote.length} in totale) per garantire la sicurezza del gruppo.
Solo il Proprietario del Gruppo e il Proprietario del Bot mantengono lo stato di amministratore.
Ho tentato di riaggiungere i ${removedCount} membri rimossi.`,
          mentions: [...adminsToDemote, ...m.participants]
        })
      } else {
        // Fallback se per qualche motivo non ci sono admin da declassare oltre agli immuni
        console.warn('[AntiNuke] Admin list già pulita (solo immuni). Tentativo di riaggiungere gli utenti.')
        await conn.groupParticipantsUpdate(m.chat, m.participants, 'add')
        await conn.sendMessage(m.chat, {
            text: `*[⚠️ ANTI-NUKE] Rilevato nuke! Non c'erano altri admin da declassare, ma ho tentato di riaggiungere i ${removedCount} membri rimossi.*`,
            mentions: m.participants
        })
      }
      
    } catch (e) {
      console.error(`[AntiNuke] ERRORE nel contrattacco massivo:`, e)
      await conn.sendMessage(m.chat, {
        text: `*[🚨 ANTI-NUKE ERRORE] Fallito il contrattacco massivo! L'admin malintenzionato potrebbe non essere stato rimosso.*`,
        mentions: [perpetrator]
      })
    }
  }
}

/**
 * @param {import('@whiskeysockets/baileys').WASocket} conn
 * @param {import('@whiskeysockets/baileys').WA_Events['group-update']} m
 * @param {Object} options
 * @param {Function} options.isBotAdmin
 */
async function onGroupUpdate(conn, m, { isBotAdmin }) {
  // --- GUARDIE DI SICUREZZA ---
  if (!m || !m.chat || !isBotAdmin) return
  
  const chat = global.db.data.chats[m.chat]
  if (!chat || !chat.antiNuke) return

  // --- LOGICA ANTI-IMPOSTAZIONI (Protezione secondaria) ---
  
  // Se 'announce' è 'false', significa che TUTTI possono parlare.
  // L'AntiNuke lo reimposta a 'true' (solo admin).
  if (m.announce === false) {
    try {
      await conn.groupSettingUpdate(m.chat, 'announcement')
      await conn.reply(m.chat, `*[🚨 ANTI-NUKE] Rilevata apertura dei messaggi a tutti. Il gruppo è stato reimpostato su "Solo Amministratori".*`)
    } catch (e) {
      console.error(`[AntiNuke] Fallito reset 'announce':`, e)
    }
  }
  
  // Se 'restrict' è 'false', significa che TUTTI possono modificare le info.
  // L'AntiNuke lo reimposta a 'true' (solo admin).
  if (m.restrict === false) {
    try {
      // 'not_restrict' è il comando baileys per impostare "solo admin modificano"
      await conn.groupSettingUpdate(m.chat, 'not_restrict')
      await conn.reply(m.chat, `*[🚨 ANTI-NUKE] Rilevata apertura modifica info. Il gruppo è stato reimpostato su "Solo Amministratori".*`)
    } catch (e) {
      console.error(`[AntiNuke] Fallito reset 'restrict':`, e)
    }
  }
}

/* ===========================
   HANDLER PRINCIPALE (Comando .antinuke on/off)
   =========================== */
let handler = async (m, { conn, args, isAdmin, isBotAdmin, isOwner, usedPrefix, command }) => {
  // Solo gli amministratori o il proprietario del bot possono usare il comando
  if (!isAdmin && !isOwner) {
    return m.reply('*[🔒] Questo comando è riservato agli amministratori del gruppo.*')
  }

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  let chat = global.db.data.chats[m.chat]

  if (!args[0]) {
    return m.reply(`*🛡️ Protezione AntiNuke MASSIVA 🛡️*
Stato attuale: *${chat.antiNuke ? '✅ ATTIVO' : '❌ DISATTIVO'}*

Usa:
*${usedPrefix}antinuke on* - Attiva la protezione
*${usedPrefix}antinuke off* - Disattiva la protezione

*Come funziona (Logica Aggressiva):*
Se un admin (che non è il Proprietario del Bot o del Gruppo) tenta di rimuovere più di 1 persona:
1.  Il bot declassa *istantaneamente tutti gli amministratori* non immuni.
2.  Rimangono amministratori SOLO il Proprietario del Bot e il Proprietario del Gruppo.
3.  I membri rimossi vengono riaggiunti.
Inoltre, il bot impedirà che il gruppo venga aperto a tutti (per messaggi o modifica info).`)
  }

  if (args[0] === 'on') {
    if (!isBotAdmin) return m.reply('*[🚨] Devo essere Amministratore per poter attivare l\'AntiNuke!*')
    chat.antiNuke = true
    return m.reply('*[✅] Protezione AntiNuke MASSIVA ATTIVATA.* Sarò vigile e aggressivo contro gli attacchi.')
  } 
  
  if (args[0] === 'off') {
    chat.antiNuke = false
    return m.reply('*[❌] Protezione AntiNuke DISATTIVATA.* Il gruppo è vulnerabile.')
  }

  return m.reply(`Opzione non valida. Usa: *${usedPrefix}antinuke on* o *off*`)
}

// Esporta i comandi e i listener
handler.command = /^(antinuke)$/i
handler.group = true
handler.fail = null

// Assegna i listener specifici agli handler corretti
handler.participantsUpdate = onParticipantsUpdate
handler.groupUpdate = onGroupUpdate

export default handler
