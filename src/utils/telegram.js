require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const balanceService = require('../services/balance.service');
const { TELEGRAM_TOKEN, TELEGRAM_CHATID } = process.env
// Substitua 'SEU_TOKEN' pelo token do seu bot
const token = TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Substitua 'SEU_CHAT_ID' pelo ID do chat onde você quer enviar a mensagem
const chatId = TELEGRAM_CHATID;

const sendMessage = (message) => {
    const parseMode = 'Markdown'
    bot.sendMessage(chatId, message, { parse_mode: parseMode })
        .then(() => {
            console.log(`Mensagem enviada: ${message}`);
        })
        .catch((error) => {
            console.error('Erro ao enviar mensagem:', error);
        });
};

bot.on('message', msg => {
    if( msg.text === '/saldo' ){
        console.log('saldo');
        getBalance()
        
        
    }
})

const getBalance = () => {
    sendMessage('Aguarde enquanto consultamos seu saldo...')
    balanceService
          .sum()
          .then(res => {
            console.log('res', res);
            
//             const content = `
// Saldo: *${res.totalProfit}*
 //   `
                sendMessage('Você perguntou sobre *saldo*')
          }).catch(e => {
            console.log('e',e.message);
            sendMessage('Poxa! Infelizmente tivemos problemas para trazer o resultado 😞')
          })
}

// Exemplo de uso
//sendMessage('Olá! Esta é uma mensagem de teste do seu aplicativo Node.js.');
module.exports = sendMessage