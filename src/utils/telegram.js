
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios')
const balanceService = require('../core/services/balance.service');
const userService = require('../core/services/user.service');
const ConfigSingleton = require('./ConfigSingleton');
const { TELEGRAM_TOKEN, TELEGRAM_CHATID } = process.env
const BOT_ID = 'robo-crypto'

// Substitua 'SEU_TOKEN' pelo token do seu bot
let bot = null
const start = () => {
    console.log('Iniciando telegram');
    
    const token = TELEGRAM_TOKEN;
    bot = new TelegramBot(token, { polling: true });

    bot.on('message', msg => {
        console.log('msg', msg);
        
        if( msg.text === '/saldo' ){
            getBalance(msg.chat.id)
        }
        // else{
        //     chatBot( msg )
        // }
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
Saldo: *${res[0].totalProfit.toFixed(2)}*
  `
                sendMessage(content)
            }).catch(e => {
            console.log('e',e.message);
            sendMessage('Poxa! Infelizmente tivemos problemas para trazer o resultado 😞')
            })
        } )   
}

const chatBot = msg => {
    console.log('chatBot',msg.chat.id);
    console.log('getAllConfig',ConfigSingleton.getAllConfig());
    if( !ConfigSingleton.get( msg.chat.id ) ){
        userService.findOne({chatId: msg.chat.id})
        .then(res => {
           console.log('chatBot res',res);
           
           if(res){
               sendMessage(`Olá, *${res.name}*!`)
               ConfigSingleton.set(msg.chat.id, res._id)
               requestBot(msg, res._id)
           }else{
               sendMessage("Infelizmente seu cadastro não foi encontrado 🥺")
           }
        })
    }else{
        requestBot( msg, ConfigSingleton.get( msg.chat.id )  )
    }
    
}

const requestBot = (msg, userId) => {
    axios({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: {
            type: "text",
            text: msg.text
        },
        url: `http://127.0.0.1:3001/api/v1/bots/${BOT_ID}/converse/${userId}`
    }).then(async res => {
        const {responses} = res.data
        
        for (let index = 0; index < responses.length; index++) {
            console.log('responses', responses[index]);
            const {text, choices} = responses[index]
            let choice = ''
            if( choices ){
        
                const rows = choices.map(c => `> *${c.value}*: ${c.title}`)
                choice = rows.join('\n')
            }
            const msg = `${text}\n${choice}`
            console.log('msg', msg);
            sendMessage( msg)
            //await delay(message.from)   
        }
    }).catch(e =>{
        console.log('error',e.response.data);
        console.log('error',e.message);
    })
}

// Exemplo de uso
//sendMessage('Olá! Esta é uma mensagem de teste do seu aplicativo Node.js.');


module.exports = {sendMessage, getBalance, setSetChatId, start}
