
const axios = require('axios')
const {format} = require('date-fns')
const { CronJob } = require('cron')

const {save} = require('../utils/file')
const operationService = require('../core/services/operation.service')
const connect = require('../config/db/connection')
const errorService = require('../core/services/error.service')
const newOrder = require('../utils/order')
const telegram = require('../utils/telegram')
const calculateProfit = require('../utils/calculateProfit')
const prepareMsg = require('../utils/prepareMsg')
const balanceService = require('../core/services/balance.service')
const UserService = require('../core/services/user.service')
const strategyService = require('../core/services/strategy.service')
const { IS_OPENED_RSI, API_URL } = process.env
let lastBuyOrder = null;
const SYMBOL = 'BTCUSDT'
const PERIOD = 14
const QUANTITY = '0.001'
const SIDE = {BUY: 'BUY', SELL: 'SELL'}
//'https://testnet.binance.vision'; //https://api.binance.com
const STRATEGY = 'RSI'


let isOpened = IS_OPENED_RSI == 'true'

const averages = (prices, period, startIndex = 1) => {
    let gains = 0
    let losses = 0
    
    for (let index = 0; index < period && (index + startIndex) < prices.length; index++) {
        
        const diff = prices[ index + startIndex] - prices[ index + startIndex - 1 ]
        
        
        if( diff >= 0 ){
            gains += diff
        }else{
            losses += Math.abs( diff )
        }
    }
    
    let avgGains = gains / period
    let avgLosses = losses / period
    return {avgGains, avgLosses}
}

const RSI = (prices, period) => {
    let avgGains = 0, avgLosses = 0
    for (let index = 1; index < prices.length; index++) {
        let newAvarages = averages( prices, period, index )
        
        if( index === 1 ){
            avgGains = newAvarages.avgGains
            avgLosses = newAvarages.avgLosses
            continue
        }
        
        avgGains = (avgGains * (period - 1) + newAvarages.avgGains ) / period
        avgLosses =  (avgLosses * (period - 1) + newAvarages.avgLosses ) / period
        
    }
    
    
    const rs = avgGains / avgLosses
    return 100 - ( 100 / (1 + rs ) )
}




const start = (strategy, user) => {
    return new Promise(async(resolve, reject)=>{
        const symbol = strategy.symbol
        const buyPrice = strategy.buyPrice
        const sellPrice = strategy.sellPrice
        const quantity = strategy.quantity
        const period = strategy.period
        
        
        
        console.clear()
        console.log('Estratégia RSI');
        console.log('IS_OPENED_RSI',isOpened);
        
        let content = ''
        const { data } = await axios.get(`${user.url}/api/v3/klines?limit=100&interval=15m&symbol=${symbol}`)
        const candle = data[ data.length - 1 ]
        const lastPrice = parseFloat( candle[4] ) 
        const date = format(new Date(), "dd/MM/yyyy HH:mm:ss") 
        console.log(date);
        content = `Data: ${date}\n`
        console.log("Price", lastPrice);
        content += `Price: ${lastPrice}\n`
        
        const prices = data.map(k => parseFloat( k[ 4 ] ))
        
        const rsi = RSI(prices, period)
        console.log('RSI', rsi);
        content += `RSI: ${rsi}\n`
        console.log('Já comprei', isOpened);
        
        
        
        newOrder.newOrder(symbol, quantity, SIDE.SELL, user).then(data =>{
            const profitResult = calculateProfit(data, data);
            const content = prepareMsg({...profitResult, strategy: 'RSI'})
            balanceService.save({...profitResult, userId: strategy.userId})
            strategyService.update(strategy.id, {isOpened: true})
            telegram.sendMessage( content )
            setTimeout(() => {
                process.exit(0)    
            }, 2000);
            
            operationService.save({...data,userId: strategy.userId, strategy: STRATEGY})
            .then(data => {
                console.log('data',data)
                
            })
            .catch(err => {
                console.log('err',err)
            })
        })
        
    })
    
}



//setInterval(start,3000)
const startRSI = () => {
    
    
    
    connect()
    .then(()=> {                    
        console.log('Conectado ao MongoDB!');
        const job = new CronJob(
            '*/10 * * * * *',
            async () => {
                
                UserService.getApproved()
                .then(async resp => {
                    
                    resp.forEach(async u => {
                        
                        telegram.setSetChatId( u.chatId )
                        
                        const strategy = await strategyService.find({userId: u._id, strategy: 'RSI', active: true})
                        strategy.forEach(element => {
                            isOpened = element.isOpened
                            
                            start(element, u)
                            .then(()=>console.log('Operaçao realizada'))
                            .catch(e=> {
                                console.log('Falha',e.message);
                                job.stop()
                                setTimeout(() => {
                                    console.log('Tentanto novamente');
                                    
                                    startRSI()
                                }, 5000);
                            })
                            
                            
                        })
                    })
                    
                })
            },
            null, // onComplete
            true, // start
            'America/Sao_Paulo' // ajuste para seu fuso horário
            
        )
        
    }).catch(e => {
        console.error('Erro ao conectar ao MongoDB:', e.message)
        console.log('Tentaremos novamente em 1 minuto');
        setTimeout(() => {
            console.log('Tentando novamente');
            
            startRSI()
        }, 5000);
        
    })
    
}


module.exports = startRSI