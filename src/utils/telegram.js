require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
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
    const chatId = msg.chat.id;
    console.log(msg.text);
    
    console.log(`ID do chat: ${chatId}`);
})

// Exemplo de uso
//sendMessage('Olá! Esta é uma mensagem de teste do seu aplicativo Node.js.');
module.exports = sendMessage