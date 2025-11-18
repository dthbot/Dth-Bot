// Definizione delle stringhe in italiano
const lenguajeIT = {
    smsNam2: () => "𝐈𝐧𝐬𝐞𝐫𝐢𝐬𝐜𝐢 𝐢𝐥 𝐜𝐚𝐳𝐳𝐨 𝐝𝐢 𝐧𝐨𝐦𝐞 𝐝𝐚 𝐜𝐚𝐦𝐛𝐢𝐚𝐫𝐞 𝐟𝐫𝐨𝐜𝐢𝐨",
    smsNam1: () => "𝐇𝐨 𝐜𝐚𝐦𝐛𝐢𝐚𝐭𝐨 𝐢𝐥 𝐧𝐨𝐦𝐞 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨?",
    smsNam3: () => "",𝐇𝐨 𝐜𝐚𝐦𝐛𝐢𝐚𝐭𝐨 𝐢𝐥 𝐧𝐨𝐦𝐞 𝐜𝐨𝐧𝐭𝐞𝐧𝐭𝐨?
    smsConMenu: () => "🔙 Torna al Menu"
  }
  
  let handler = async (m, { conn, args, text }) => {
    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || './media/chatunitybot.mp4'
    
    if (!text) return conn.reply(m.chat, lenguajeIT.smsNam2(), fkontak, m)
    
    try {
      let text = args.join` `
      if(args && args[0]) {
        await conn.groupUpdateSubject(m.chat, text)
      }
      
      await conn.reply(m.chat, lenguajeIT.smsNam1(), fkontak, m)
      // Alternativa con pulsante:
      // await conn.sendButton(
      //   m.chat, 
      //   'Nome modificato', 
      //   lenguajeIT.smsNam1(), 
      //   pp, 
      //   [[lenguajeIT.smsConMenu(), '/menu']], 
      //   fkontak, 
      //   m
      // )
      
    } catch (e) {
      console.error('Errore nel comando setname:', e)
      throw lenguajeIT.smsNam3()
    }
  }
  
  handler.command = /^(setname|setnome)$/i
  handler.group = true
  handler.admin = true
  handler.botAdmin = true
  export default handler
