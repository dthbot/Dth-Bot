/**
 * Sistema Moderatori (custom, NON admin WhatsApp)
 */

export function isMod(m) {
    // Deve essere usato solo nei gruppi
    if (!m.isGroup) return false;

    // Inizializza struttura se non esiste
    global.db.data.mods ||= {};
    global.db.data.mods[m.chat] ||= {};

    // Ritorna true se l'utente è moderatore del gruppo
    return !!global.db.data.mods[m.chat][m.sender];
}

/**
 * Controllo permessi completo
 * Owner e Admin WhatsApp bypassano sempre
 */
export function canUseModCommands(m) {
    if (m.isOwner) return true;
    if (m.isAdmin) return true;
    return isMod(m);
}