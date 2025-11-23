import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import '../lib/language.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STEPS = {
  'sig-step1': `🟢 *Step 1 — Materiali*
Raccogli tutto ciò che ti serve:
• Cartine per rollare
• Filtro/tip (opzionale, consigliato)
• Tabacco (quantità a piacere)
• Un ripiano pulito o un vassoio
Nota: usa solo tabacco legale e rispetta la legge nel tuo paese. Solo per adulti.`,
  'sig-step2': `🟡 *Step 2 — Preparare il filtro e la cartina*
1. Se usi un filtro, arrotolalo o piegalo per creare un tip stabile.
2. Apri la cartina tenendola con la colla verso l'alto e rivolta lontano da te.
3. Posiziona il filtro su un'estremità della cartina.`,
  'sig-step3': `🟠 *Step 3 — Riempire con il tabacco*
1. Sbriciola il tabacco con le dita per una consistenza uniforme.
2. Distribuisci il tabacco lungo la cartina, in modo omogeneo — né troppa né troppo poca.
3. Mantieni il bordo vicino al filtro leggermente più pieno per facilitare la chiusura.`,
  'sig-step4': `🔵 *Step 4 — Arrotolare e dare forma*
1. Usa il pollice e l'indice per stringere leggermente la cartina tra il tabacco.
2. Con un movimento rollante (avanti/indietro), compatta e dai forma cilindrica.
3. Quando sei soddisfatto, usa il pollice per infilare la parte inferiore della cartina dentro la rollata, poi passa la linguetta con la colla sopra e premi per sigillare.`,
  'sig-step5': `⚫ *Step 5 — Rifinitura e accensione*
1. Liscia i bordi con le dita e, se serve, compatta leggermente l'estremità aperta con una penna o il filtro.
2. Tapa leggermente l'estremità aperta per non perdere tabacco.
3. Accendi con cautela e fai tiri leggeri.
⚠️ Avvertenza salute: fumare è dannoso per la salute. Consuma responsabilmente solo se maggiorenne e informato sui rischi.`
};

const handler = async (m, { conn, usedPrefix = '.' }) => {
  const command = (m.text || '').trim().toLowerCase().replace(/\s+/g, '');
  // Se il comando è esattamente .sigaretta => mostra il menu con i bottoni
  if (/^\.?sigaretta$/i.test(m.text || '')) {
    const imagePath = path.join(__dirname, '../media/principale.jpeg');
    const title = `𝔻𝕋ℍ-𝔹𝕆𝕋 *Menu Sigaretta*`;

    const caption = `${title}

Solo per fumatori adulti. Le informazioni seguenti sono istruttive per il tabacco legale; non promuovo l'uso di sostanze illegali.

Scegli uno step con i bottoni qui sotto per vedere il procedimento passo-passo.`;

    await conn.sendMessage(
      m.chat,
      {
        image: fs.existsSync(imagePath) ? { url: imagePath } : undefined,
        caption,
        footer: 'Usa i bottoni per navigare gli step',
        buttons: [
          { buttonId: `${usedPrefix}sig-step1`, buttonText: { displayText: 'Step 1' }, type: 1 },
          { buttonId: `${usedPrefix}sig-step2`, buttonText: { displayText: 'Step 2' }, type: 1 },
          { buttonId: `${usedPrefix}sig-step3`, buttonText: { displayText: 'Step 3' }, type: 1 },
          { buttonId: `${usedPrefix}sig-step4`, buttonText: { displayText: 'Step 4' }, type: 1 },
          { buttonId: `${usedPrefix}sig-step5`, buttonText: { displayText: 'Step 5' }, type: 1 }
        ],
        headerType: 4
      },
      { quoted: m }
    );
    return;
  }

  // Gestione dei comandi step inviati tramite bottoni (es. .sig-step1)
  const normalized = (m.text || '').trim().toLowerCase();
  const key = normalized.replace('.', '');
  if (STEPS[key]) {
    await conn.sendMessage(
      m.chat,
      { text: STEPS[key] },
      { quoted: m }
    );
    return;
  }

  // fallback: se il plugin viene richiamato con altro testo, mostra istruzioni base
  if (/^\.?sig-step(1|2|3|4|5)$/i.test(m.text || '')) {
    const k = (m.text || '').trim().toLowerCase().replace('.', '');
    if (STEPS[k]) {
      await conn.sendMessage(m.chat, { text: STEPS[k] }, { quoted: m });
      return;
    }
  }

  // se non è niente di sopra, ignora (non crashare)
  return;
};

handler.help = ['sigaretta'];
handler.tags = ['utility'];
handler.command = /^(sigaretta|sig-step1|sig-step2|sig-step3|sig-step4|sig-step5)$/i;

export default handler;
