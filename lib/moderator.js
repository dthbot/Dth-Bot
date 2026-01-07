/**
 * Sistema Moderatori (custom, NON admin WhatsApp)
 * Solo numeri autorizzati possono diventare moderatori
 */

const WHITELIST = [
    '447880017985@s.whatsapp.net', // deadly
    '447529686760@s.whatsapp.net', // vixiie
    '48726875208@s.whatsapp.net'   // vampexa
];

export function isMod(m) {
    if (!m.isGroup) return false;

    global.db.data.mods ||= {};
    global.db.data.mods[m.chat] ||= {};

    return !!global.db.data.mods[m.chat][m.sender];
}

export function canUseModCommands(m) {
    if (m.isOwner) return true;
    if (m.isAdmin) return true;
    return isMod(m);
}

/**
 * Controlla se un numero può essere aggiunto come moderatore
 */
export function isAuthorizedNumber(jid) {
    return WHITELIST.includes(jid);
}