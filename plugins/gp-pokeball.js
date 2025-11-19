// PLUGIN .pokeball
let handler = async (m, { conn }) => {
  let msg = `
🎮 *POKÉMON DEL GRUPPO EVOCATO!* 🎮  

✨ Nome: *Axtral aka Pokémon di fiducia*  
💪 Classe: *Tipo Elettrico-Leggendario*  
😂 Abilità speciale: *Far ridere il gruppo anche alle 3 di notte!*  
🌍 Descrizione: questo esemplare raro appare solo quando un admin digita il comando segreto.  
💞 Missione: trovare una compagna allenatrice prima che arrivi la prossima stagione di Pokémon!  
⚡ Motto: “Se non sei pronto a ridere, non evocarmi sono troppo gay a spaventarmi!”
`

  conn.sendMessage(m.chat, { text: msg }, { quoted: m })
}

handler.command = /^pokeball$/i
handler.admin = true // solo admin possono evocarlo (come da descrizione)

export default handler
