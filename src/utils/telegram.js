
const TelegramBot = require('node-telegram-bot-api');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios')
const balanceService = require('../core/services/balance.service');
const userService = require('../core/services/user.service');
const ConfigSingleton = require('./ConfigSingleton');
const { TELEGRAM_TOKEN, TELEGRAM_CHATID } = process.env
const BOT_ID = 'robo-crypto-nlu'

// Substitua 'SEU_TOKEN' pelo token do seu bot
let bot = null
let chatId = TELEGRAM_CHATID;
const start = () => {
    
    const token = TELEGRAM_TOKEN;
    bot = new TelegramBot(token, { polling: true });
    console.log('Telegram Iniciado');
    console.log('getAllConfig',ConfigSingleton.getAllConfig());
    
    bot.on('message', msg => {
        if( !chatId ) chatId = msg.chat.id
        console.log('msg',msg);
        console.log('getAllConfig',ConfigSingleton.getAllConfig());
        if( msg.text === '/saldo' ){
            getBalance(msg.chat.id)
        }
        else{
            console.log('chatbot');
            
            chatBot( msg )
        }
    })    
    
}

// Substitua 'SEU_CHAT_ID' pelo ID do chat onde você quer enviar a mensagem

const setSetChatId = id => chatId = id

const sendMessage = message => {
    return new Promise((resolve, reject)=>{
        if( bot ){
            const parseMode = 'Markdown'
            bot.sendMessage(chatId, message, { parse_mode: parseMode })
                .then(() => {
                    console.log(`Mensagem enviada: ${message}`);
                    resolve({})
                })
                .catch((error) => {
                    console.error('Erro ao enviar mensagem:', error);
                    reject({})
                });
        }

    })
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
    const uuid = uuidv4()
    if( !ConfigSingleton.get( msg.chat.id ) ){
        ConfigSingleton.set(msg.chat.id, uuid)
        userService.findOne({chatId: msg.chat.id})
        .then(async res => {
           console.log('chatBot res',res);
           
           if(res){
               await sendMessage(`Olá, *${res.name}*!`)
               ConfigSingleton.set(uuid, res._id)
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
    console.log('requestBot msg',msg.text);
    
    const chatId = ConfigSingleton.get( msg.chat.id )
    const _userId = ConfigSingleton.get( chatId )
    axios({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: {
            type: "text",
            text: msg.text,
            metadata: {userId: _userId}
        },
        url: `http://127.0.0.1:3001/api/v1/bots/${BOT_ID}/converse/${userId}`
    }).then(async res => {
        const {responses} = res.data
        console.log('responses',responses);
        
        for (let index = 0; index < responses.length; index++) {
            console.log(`responses[${index}]`, responses[index]);
            const {text, choices} = responses[index]
            
            
            if( choices ){
        
                //const rows = choices.map(c => `> *${c.value}*: ${c.title}`)
                const rows = choices.map(c => [{value: c.value, text: c.title}])
                //choice = rows.join('\n')
                //const msg = `${text}\n${choice}`
                console.log('rows',rows);
                
                await sendMainMenu( rows )
            }else{
                console.log('msg', msg);
                await sendMessage( text )
            }
            //await delay(message.from)   
        }
    }).catch(e =>{
        console.log('requestBot Erro ',e);
        
        //console.log('error',e.response.data);
        //console.log('error',e.message);
    })
}

const sendMainMenu = msg => {
    return new Promise((resolve, reject)=>{

        const options = {
            reply_markup: {
                keyboard: msg,
                resize_keyboard: true,
                one_time_keyboard: true // Remove o teclado após o usuário clicar
            }
        };
    
        bot.sendMessage(chatId, 'Escolha uma opção:', options);
        resolve({})
    })
};

// Exemplo de uso
//sendMessage('Olá! Esta é uma mensagem de teste do seu aplicativo Node.js.');


module.exports = {sendMessage, getBalance, setSetChatId, start}
