// Legge il messaggio indipendentemente dalla versione ChatUnity
let msg =
    message.body?.toLowerCase() ||
    message.text?.toLowerCase() ||
    message.message?.toLowerCase() ||
    "";

// Lista auto
const cars = {
    sultan: { name: "Sultan", img: "https://i.imgur.com/2L67zUY.png" },
    elegy: { name: "Elegy", img: "https://i.imgur.com/JhWmY8W.png" },
    banshee: { name: "Banshee", img: "https://i.imgur.com/Ae1nnCV.png" },
    buffalo: { name: "Buffalo", img: "https://i.imgur.com/FfGgS74.png" },
    supergt: { name: "SuperGT", img: "https://i.imgur.com/NvQHF2A.png" }
};

// -------------------------------------------------------------------
// LISTINO AUTO CON I PULSANTI
// -------------------------------------------------------------------
if (msg === ".compra_auto") {
    sendMessage({
        chatId: message.from,
        text: "🚘 *Autosalone – Seleziona un'auto:*",
        buttons: [
            ["buy_sultan", "Sultan"],
            ["buy_elegy", "Elegy"],
            ["buy_banshee", "Banshee"],
            ["buy_buffalo", "Buffalo"],
            ["buy_supergt", "SuperGT"]
        ]
    });
    return;
}

// -------------------------------------------------------------------
// RISPOSTA AI PULSANTI
// -------------------------------------------------------------------
if (message.buttonResponseId) {
    const id = message.buttonResponseId.replace("buy_", ""); // es: elegy
    const car = cars[id];

    if (!car) {
        sendMessage({
            chatId: message.from,
            text: "❌ Auto non valida."
        });
        return;
    }

    sendMessage({
        chatId: message.from,
        image: car.img,
        caption: `🚗 *Hai acquistato una ${car.name}!*`
    });

    return;
}
