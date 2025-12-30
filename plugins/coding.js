/*
  =============================================================
  PLUGIN: .impara (Accademia di Coding)
  DESCRIZIONE: Fornisce risorse, canali YouTube e siti web per 
               imparare i principali linguaggi di programmazione.
               Struttura stabile (Solo Testo + Bottoni).
  =============================================================
*/

// =======================================================
// DATABASE RISORSE (Canali e Siti)
// =======================================================

const CODING_RESOURCES = {
    JAVASCRIPT: {
        title: "🟨 JAVASCRIPT (Web & Logic)",
        desc: "Il linguaggio del web. Essenziale per frontend, backend (Node.js) e interattività.",
        youtube: [
            "🇮🇹 *Ferry* (Tutorial completi)",
            "🇮🇹 *Samuraj* (Ottimo per iniziare)",
            "🇺🇸 *Traversy Media* (Progetti pratici)",
            "🇺🇸 *The Coding Train* (Creatività e P5.js)"
        ],
        websites: [
            "🔗 *MDN Web Docs* (La bibbia di JS)",
            "🔗 *Javascript.info* (Guida moderna)",
            "🔗 *FreeCodeCamp* (Corsi interattivi)"
        ]
    },
    PYTHON: {
        title: "🐍 PYTHON (Data & AI)",
        desc: "Versatile e potente. Re indiscusso per Intelligenza Artificiale, Data Science e Scripting.",
        youtube: [
            "🇮🇹 *PyMike* (Tutorial italiani chiari)",
            "🇺🇸 *Programming with Mosh* (Veloce ed efficace)",
            "🇺🇸 *Tech With Tim* (Progetti divertenti)",
            "🇺🇸 *Corey Schafer* (Approfondimenti tecnici)"
        ],
        websites: [
            "🔗 *Real Python* (Tutorial di qualità)",
            "🔗 *W3Schools Python* (Basi semplici)",
            "🔗 *Kaggle* (Per Data Science)"
        ]
    },
    HTMLCSS: {
        title: "🎨 HTML & CSS (Design)",
        desc: "Le fondamenta. HTML struttura la pagina, CSS la rende bella. Non sono linguaggi di programmazione, ma di markup e stile.",
        youtube: [
            "🇮🇹 *Marcell* (Ottimo per il Frontend)",
            "🇺🇸 *Kevin Powell* (Il mago del CSS)",
            "🇺🇸 *DesignCourse* (UI/UX Design)"
        ],
        websites: [
            "🔗 *CSS-Tricks* (Trucchi e guide)",
            "🔗 *W3Schools* (Riferimento rapido)",
            "🔗 *Frontend Mentor* (Sfide pratiche)"
        ]
    },
    JAVA: {
        title: "☕ JAVA (Enterprise & Android)",
        desc: "Robusto e orientato agli oggetti. Usato per grandi sistemi aziendali e app Android native.",
        youtube: [
            "🇮🇹 *Filippo Custom* (Tutorial base)",
            "🇺🇸 *Bro Code* (Corsi completi e divertenti)",
            "🇺🇸 *Amigoscode* (Livello avanzato)"
        ],
        websites: [
            "🔗 *Oracle Documentation* (Ufficiale)",
            "🔗 *GeeksforGeeks* (Esercizi e teoria)",
            "🔗 *Hyperskill* (JetBrains Academy)"
        ]
    },
    CSHARP: {
        title: "👾 C# (Unity & Windows)",
        desc: "Sviluppato da Microsoft. Fondamentale per sviluppare videogiochi con Unity o app Windows.",
        youtube: [
            "🇺🇸 *Brackeys* (Il leggendario canale Unity)",
            "🇺🇸 *Code Monkey* (Sviluppo giochi indie)",
            "🇺🇸 *Tim Corey* (Sviluppo .NET)"
        ],
        websites: [
            "🔗 *Microsoft Learn* (Percorsi ufficiali)",
            "🔗 *Unity Learn* (Per game dev)",
            "🔗 *StackOverflow* (Il tuo migliore amico)"
        ]
    }
};

// =======================================================
// HANDLER PRINCIPALE
// =======================================================

let handler = async (m, { conn, usedPrefix, command, pushname }) => {
    
    const senderName = pushname || 'Studente';
    
    // 1. Parsing dell'input (Cattura comando e click pulsante)
    const btnId = m?.message?.buttonsResponseMessage?.selectedButtonId || "";
    const text = m.text || btnId || "";
    
    // Estrai argomento: .impara PYTHON -> PYTHON
    const arg = text.replace(new RegExp(`^${usedPrefix}(impara|coding|learn)\\s*`, 'i'), "").trim().toUpperCase();

    try {
        // --- LOGICA DI ROUTING ---

        // Se l'utente ha selezionato un linguaggio valido
        if (CODING_RESOURCES[arg]) {
            const data = CODING_RESOURCES[arg];
            
            // Costruzione messaggio dettagliato
            let details = `📚 *CORSO: ${data.title}*\n`;
            details += `_${data.desc}_\n\n`;
            
            details += `📺 *CANALI YOUTUBE CONSIGLIATI:*\n`;
            data.youtube.forEach(yt => details += `> ${yt}\n`);
            
            details += `\n🌐 *SITI WEB & DOCUMENTAZIONE:*\n`;
            data.websites.forEach(web => details += `> ${web}\n`);
            
            details += `\n_Buono studio! La costanza è la chiave._ 🧠`;

            // Bottone per tornare indietro
            const backButton = [
                { buttonId: `${usedPrefix}${command}`, buttonText: { displayText: "⬅️ Torna alle Materie" }, type: 1 }
            ];

            return await conn.sendMessage(m.chat, {
                text: details,
                footer: "Rinox Coding Academy",
                buttons: backButton,
                headerType: 1
            }, { quoted: m });
        }

        // --- MENU PRINCIPALE (Se nessun argomento o argomento non valido) ---
        
        const menuText = `
🎓 *RINOX CODING ACADEMY* 🎓
_Benvenuto, ${senderName}!_

Scegli il linguaggio che vuoi imparare oggi.
Ti fornirò i migliori canali e siti per iniziare da zero o migliorare.

👇 *SELEZIONA UNA MATERIA:*
`;

        const buttons = [
            { buttonId: `${usedPrefix}${command} JAVASCRIPT`, buttonText: { displayText: "🟨 JAVASCRIPT (Web)" }, type: 1 },
            { buttonId: `${usedPrefix}${command} PYTHON`, buttonText: { displayText: "🐍 PYTHON (AI/Dati)" }, type: 1 },
            { buttonId: `${usedPrefix}${command} HTMLCSS`, buttonText: { displayText: "🎨 HTML & CSS" }, type: 1 },
            { buttonId: `${usedPrefix}${command} JAVA`, buttonText: { displayText: "☕ JAVA (App)" }, type: 1 },
            { buttonId: `${usedPrefix}${command} CSHARP`, buttonText: { displayText: "👾 C# (Unity/Giochi)" }, type: 1 },
        ];

        await conn.sendMessage(m.chat, {
            text: menuText.trim(),
            footer: "Impara, Crea, Compila.",
            buttons: buttons,
            headerType: 1
        }, { quoted: m });

    } catch (e) {
        console.error(`Errore nel plugin Impara:`, e);
        m.reply("❌ Si è verificato un errore nel recupero delle risorse.");
    }
};

handler.help = ['impara', 'coding'];
handler.tags = ['utility', 'edu'];
handler.command = /^(impara|coding|learn)$/i;
handler.group = true; 
handler.private = true;

export default handler;
