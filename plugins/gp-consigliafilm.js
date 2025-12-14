const entertainment = [
  // ---- FILM CLASSICI ----
  { title: "Inception", description: "Un viaggio nei sogni e nella mente.", genre: "Fantascienza/Thriller", type: "Film", year: 2010 },
  { title: "Il Padrino", description: "La storia epica della famiglia mafiosa Corleone.", genre: "Crimine/Drama", type: "Film", year: 1972 },
  { title: "Interstellar", description: "Un viaggio attraverso lo spazio e il tempo per salvare l’umanità.", genre: "Fantascienza/Drama", type: "Film", year: 2014 },
  { title: "Forrest Gump", description: "La storia di un uomo speciale che vive una vita incredibile.", genre: "Drama", type: "Film", year: 1994 },
  { title: "The Dark Knight", description: "Batman affronta il Joker in uno scontro epico.", genre: "Azione/Crimine", type: "Film", year: 2008 },
  { title: "Pulp Fiction", description: "Storie criminali intrecciate e dialoghi leggendari.", genre: "Crime/Drama", type: "Film", year: 1994 },
  { title: "Fight Club", description: "Una critica alla società moderna attraverso una doppia identità.", genre: "Thriller/Drama", type: "Film", year: 1999 },
  { title: "The Matrix", description: "Un hacker scopre la verità dietro la simulazione.", genre: "Fantascienza/Azione", type: "Film", year: 1999 },

  // ---- NUOVI FILM AGGIUNTI ----
  { title: "Avatar", description: "Una guerra tra umani e Na'vi su Pandora.", genre: "Fantascienza/Avventura", type: "Film", year: 2009 },
  { title: "The Wolf of Wall Street", description: "La storia folle di Jordan Belfort e della sua scalata finanziaria.", genre: "Biografico/Drama", type: "Film", year: 2013 },
  { title: "Shutter Island", description: "Due agenti indagano su una misteriosa scomparsa in un ospedale psichiatrico.", genre: "Thriller/Mistero", type: "Film", year: 2010 },
  { title: "Mad Max: Fury Road", description: "Una corsa sfrenata nel deserto post-apocalittico.", genre: "Azione", type: "Film", year: 2015 },
  { title: "John Wick", description: "Un assassino leggendario torna in azione dopo un torto personale.", genre: "Azione", type: "Film", year: 2014 },
  { title: "The Social Network", description: "La storia della nascita di Facebook.", genre: "Biografico/Drama", type: "Film", year: 2010 },
  { title: "The Pianist", description: "La drammatica storia di un pianista durante la guerra.", genre: "Biografico/Drama", type: "Film", year: 2002 },
  { title: "Joker", description: "La nascita del celebre villain della DC.", genre: "Thriller/Drama", type: "Film", year: 2019 },
  { title: "Gladiator", description: "Un generale romano diventa gladiatore per vendetta.", genre: "Azione/Drama", type: "Film", year: 2000 },
  { title: "Gran Torino", description: "Un veterano scorbutico trova amicizia e redenzione.", genre: "Drama", type: "Film", year: 2008 },
  { title: "The Avengers", description: "I supereroi più forti della Terra si uniscono.", genre: "Azione/Fantascienza", type: "Film", year: 2012 },
  { title: "Deadpool", description: "Un antieroe sarcastico e violento affronta la vendetta.", genre: "Azione/Commedia", type: "Film", year: 2016 },
  { title: "IT", description: "Il terrificante clown Pennywise tormenta un gruppo di ragazzi.", genre: "Horror", type: "Film", year: 2017 },
  { title: "Scream", description: "Un killer mascherato perseguita una cittadina.", genre: "Horror/Thriller", type: "Film", year: 1996 },
  { title: "Donnie Darko", description: "Un ragazzo tormentato affronta visioni inquietanti.", genre: "Mistero/Sci-Fi", type: "Film", year: 2001 },
  { title: "Top Gun: Maverick", description: "Maverick torna a volare in una missione impossibile.", genre: "Azione", type: "Film", year: 2022 },

  // ---- SERIE TV ----
  { title: "Breaking Bad", description: "Un professore diventa un pericoloso signore della droga.", genre: "Crime/Drama", type: "Serie TV", year: 2008 },
  { title: "La Casa di Carta", description: "La rapina del secolo alla Zecca di Spagna.", genre: "Crime/Thriller", type: "Serie TV", year: 2017 },
  { title: "Stranger Things", description: "Ragazzi degli anni '80 affrontano eventi sovrannaturali.", genre: "Fantascienza/Horror", type: "Serie TV", year: 2016 },
  { title: "The Witcher", description: "Le avventure di Geralt di Rivia, cacciatore di mostri.", genre: "Fantasy/Azione", type: "Serie TV", year: 2019 },
  { title: "Cobra Kai", description: "Il sequel di Karate Kid e della rivalità tra dojo.", genre: "Azione/Drama", type: "Serie TV", year: 2018 },
  { title: "Game of Thrones", description: "La lotta per il potere nel continente di Westeros.", genre: "Fantasy/Drama", type: "Serie TV", year: 2011 },
  { title: "The Boys", description: "Supereroi corrotti contro vigilanti determinati.", genre: "Azione/Drama", type: "Serie TV", year: 2019 },
  { title: "Peaky Blinders", description: "L’ascesa della gang dei fratelli Shelby.", genre: "Crime/Drama", type: "Serie TV", year: 2013 },
  { title: "Lucifer", description: "Il diavolo vive a Los Angeles e aiuta la polizia.", genre: "Fantasy/Crime", type: "Serie TV", year: 2016 }
];

const handler = async (m, { conn }) => {
  const randomPick = entertainment[Math.floor(Math.random() * entertainment.length)];

  const msg = `🎬 *Consiglio ${randomPick.type}*

*Titolo:* ${randomPick.title}
*Genere:* ${randomPick.genre}
*Anno:* ${randomPick.year}
*Descrizione:* ${randomPick.description}
  `;

  await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
};

handler.command = /^(consigliafilm|consigliaserie|ai_consiglia-film)$/i;
handler.tags = ['ai'];
export default handler;
