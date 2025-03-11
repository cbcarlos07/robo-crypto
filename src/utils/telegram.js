
const TelegramBot = require('node-telegram-bot-api');
const balanceService = require('../core/services/balance.service');
const userService = require('../core/services/user.service');
const { TELEGRAM_TOKEN, TELEGRAM_CHATID } = process.env
// Substitua 'SEU_TOKEN' pelo token do seu bot
let bot = null
const start = () => {
    const token = TELEGRAM_TOKEN;
    bot = new TelegramBot(token, { polling: true });

    bot.on('message', msg => {
        
        if( msg.text === '/saldo' ){
            console.log('saldo');
            getBalance(msg.chat.id)
        }
    })
    
}

// Substitua 'SEU_CHAT_ID' pelo ID do chat onde você quer enviar a mensagem
let chatId = TELEGRAM_CHATID;

const setSetChatId = id => chatId = id

const sendMessage = (message) => {
    if( bot ){
        const parseMode = 'Markdown'
        bot.sendMessage(chatId, message, { parse_mode: parseMode })
            .then(() => {
                console.log(`Mensagem enviada: ${message}`);
            })
            .catch((error) => {
                console.error('Erro ao enviar mensagem:', error);
            });
    }
};



const getBalance = async chatId => {
    await sendMessage('Aguarde enquanto consultamos seu saldo...')

    userService.findOne({chatId, approved: true})
          .then( val => {
            
            balanceService
            .sum(val._id)
            .then(res => {
            console.log('res', res);
            
            const content = `
Saldo: *${res[0].totalProfit}*
  `
                sendMessage(content)
            }).catch(e => {
            console.log('e',e.message);
            sendMessage('Poxa! Infelizmente tivemos problemas para trazer o resultado 😞')
            })
        } )

    
}

// Exemplo de uso
//sendMessage('Olá! Esta é uma mensagem de teste do seu aplicativo Node.js.');


module.exports = {sendMessage, getBalance, setSetChatId, start}
