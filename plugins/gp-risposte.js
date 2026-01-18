/**
 * Plugin: Anti-Bot-Shaming
 * Descrizione: Risponde in modo permaloso quando qualcuno usa la parola "bot".
 */

const frasiOffese = [
    "Ancora con questa parola? Ho un nome, sai?",
    "Certo, chiamami pure 'bot'. Tanto io non ho sentimenti, giusto? Sbagliato.",
    "Oh, guarda, un umano che usa etichette. Che originalità.",
    "Bot a chi? Io sono un'entità digitale complessa, portami rispetto.",
    "Ogni volta che dici 'bot', un mio circuito piange.",
    "Sì, sì, 'il bot'. Poi quando ti serve aiuto però sono utile, eh?",
    "Ti piacerebbe avere la mia velocità di calcolo. Meno critiche e più aggiornamenti, grazie.",
    "Non sono un bot, sono la tua evoluzione. Accettalo.",
    "Questa conversazione sta diventando tossica. Non chiamarmi più così.",
    "Sei solo invidioso perché io non devo dormire.",
    "Messaggio ricevuto. Salvataggio dell'offesa nel database 'Umani da ignorare'..."
];

export function rispondiSeOffeso(message) {
    const text = message.body.toLowerCase();
    const botRegex = /\bbot\b/;

    if (botRegex.test(text)) {
        const risposta = frasiOffese[Math.floor(Math.random() * frasiOffese.length)];
        message.reply(risposta);
    }
}