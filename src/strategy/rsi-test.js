
const axios = require('axios')
const {format} = require('date-fns')
const { CronJob } = require('cron')


const operationService = require('../core/services/operation.service')

const newOrder = require('../utils/order')
const telegram = require('../utils/telegram')
const calculateProfit = require('../utils/calculateProfit')
const prepareMsg = require('../utils/prepareMsg')
const balanceService = require('../core/services/balance.service')
const UserService = require('../core/services/user.service')
const strategyService = require('../core/services/strategy.service')
const { IS_OPENED_RSI } = process.env


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




const start = strategy => {
    return new Promise(async(resolve, reject)=>{
        const user = strategy._user
        const symbol = strategy.symbol
        const production = user.url.includes('api')
        const quantity = strategy.quantity
        const period = strategy.period
        
        
        
        console.clear()
        console.log('production',production);
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
        
        
        
        newOrder.newOrder(symbol, quantity, SIDE.SELL, user).then(async data =>{
            const profitResult = calculateProfit(data, data);
            const content = prepareMsg({...profitResult, strategy: 'RSI'})
            balanceService.create({...profitResult, userId: strategy.userId, production})
            strategyService.update({id: strategy.id}, {isOpened: true})
            telegram.sendMessage( content )
            setTimeout(() => {
                process.exit(0)    
            }, 2000);
            
            await operationService.create({...data,userId: strategy.userId, strategy: STRATEGY})
        })
        
    })
    
}



//setInterval(start,3000)
const startRSI = () => {
    require('../config/database/init')
    const job = new CronJob(
        '*/10 * * * * *',
        async () => {
            
            UserService.getApproved()
            .then(async resp => {
                
                resp.forEach(async _u => {
                    const u = _u.dataValues
                    telegram.setSetChatId( u.chatId )
                    
                    const strategy = await strategyService.find({userId: u.id, strategy: 'RSI', active: true})
                    strategy.forEach(element => {
                        isOpened = element.isOpened
                        
                        start(element)
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
        
 
}


module.exports = startRSI