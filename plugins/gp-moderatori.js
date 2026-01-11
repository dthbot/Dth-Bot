// plugin-moderatori-simple.js
module.exports = {
    name: 'Moderatori List',
    
    async init(bot) {
        console.log('✅ Plugin Moderatori List attivo');
        
        bot.on('message', async (message) => {
            if (!message.body) return;
            
            const text = message.body.toLowerCase();
            
            if (text === '.moderatori' || text === '.mods') {
                await this.handleModeratoriCommand(message, bot);
            }
            
            if (text === '.moderatori online') {
                await this.handleModeratoriOnline(message, bot);
            }
        });
    },
    
    async handleModeratoriCommand(message, bot) {
        try {
            // MODIFICA QUESTA PARTE - Come recuperi i moderatori?
            // Esempio 1: da variabile globale del bot
            const moderatori = bot.moderatori || [];
            
            // Esempio 2: da database
            // const moderatori = await bot.db.getModeratori();
            
            // Esempio 3: da file
            // const moderatori = require('./moderatori.json');
            
            if (!moderatori || moderatori.length === 0) {
                return bot.sendMessage(message.from, {
                    text: '🔍 *LISTA MODERATORI*\n\nNessun moderatore registrato.\n\nUsa `.aggiungimod` per aggiungerne uno.'
                });
            }
            
            let response = '👑 *MODERATORI DEL BOT*\n━━━━━━━━━━━━━━━━\n\n';
            
            moderatori.forEach((mod, i) => {
                // Formatta il nome
                const nome = mod.nome || mod.id || 'Sconosciuto';
                const livello = mod.livello ? ` [${mod.livello}]` : '';
                
                response += `*${i + 1}. ${nome}*${livello}\n`;
                
                // Informazioni aggiuntive
                if (mod.permessi && mod.permessi.length > 0) {
                    response += `   🔧 ${mod.permessi.join(', ')}\n`;
                }
                
                if (mod.data) {
                    const data = new Date(mod.data).toLocaleDateString('it-IT');
                    response += `   📅 ${data}\n`;
                }
                
                response += '\n';
            });
            
            response += `━━━━━━━━━━━━━━━━\n📊 *Totale: ${moderatori.length} moderatori*`;
            
            await bot.sendMessage(message.from, { text: response });
            
        } catch (error) {
            console.error('Errore comando moderatori:', error);
            await bot.sendMessage(message.from, {
                text: '❌ Errore nel caricamento della lista moderatori.'
            });
        }
    },
    
    async handleModeratoriOnline(message, bot) {
        // Mostra solo moderatori online
        const moderatori = bot.moderatori || [];
        const onlineMods = moderatori.filter(mod => mod.online === true);
        
        if (onlineMods.length === 0) {
            return bot.sendMessage(message.from, {
                text: '👁️ *MODERATORI ONLINE*\n\nNessun moderatore online al momento.'
            });
        }
        
        let response = '👁️ *MODERATORI ONLINE*\n━━━━━━━━━━━━━━━━\n\n';
        
        onlineMods.forEach((mod, i) => {
            response += `🟢 *${mod.nome}*\n`;
            
            if (mod.ultimaAttivita) {
                const tempo = this.calcolaTempoOnline(mod.ultimaAttivita);
                response += `   ⏱️ Online da: ${tempo}\n`;
            }
            
            response += '\n';
        });
        
        response += `━━━━━━━━━━━━━━━━\n🟢 Online: ${onlineMods.length}/${moderatori.length}`;
        
        await bot.sendMessage(message.from, { text: response });
    },
    
    calcolaTempoOnline(dataInizio) {
        const diff = Date.now() - new Date(dataInizio).getTime();
        const minuti = Math.floor(diff / 60000);
        
        if (minuti < 60) return `${minuti} minuti`;
        const ore = Math.floor(minuti / 60);
        if (ore < 24) return `${ore} ore`;
        return `${Math.floor(ore / 24)} giorni`;
    }
};