require('dotenv').config()
const axios = require('axios')
const {format} = require('date-fns')

const { CronJob } = require('cron')

const {save} = require('./file')
const operationService = require('./services/operation.service')
const connect = require('./db/connection')
const errorService = require('./services/error.service')
const newOrder = require('./utils/order')

connect()

const { IS_OPENED_RSI } = process.env

const SYMBOL = 'BTCUSDT'
const PERIOD = 14
const QUANTITY = '0.001'
const SIDE = {BUY: 'BUY', SELL: 'SELL'}
const API_URL = 'https://testnet.binance.vision' //'https://testnet.binance.vision'; //https://api.binance.com
const STRATEGY = 'RSI'


let isOpened = false

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




const start = async () => {
    console.clear()
    console.log('Estratégia RSI');
    console.log('IS_OPENED',IS_OPENED_RSI);
    
    isOpened = IS_OPENED_RSI == 'true'
    let content = ''
    const { data } = await axios.get(`${API_URL}/api/v3/klines?limit=100&interval=15m&symbol=${SYMBOL}`)
    const candle = data[ data.length - 1 ]
    const lastPrice = parseFloat( candle[4] ) 
    const date = format(new Date(), "dd/MM/yyyy HH:mm:ss") 
    console.log(date);
    content = `Data: ${date}\n`
    console.log("Price", lastPrice);
    content += `Price: ${lastPrice}\n`
    
    const prices = data.map(k => parseFloat( k[ 4 ] ))
    
    const rsi = RSI(prices, PERIOD)
    console.log('RSI', rsi);
    content += `RSI: ${rsi}\n`
    console.log('Já comprei', isOpened);
    
    
    newOrder(SYMBOL, QUANTITY, SIDE.SELL).then(data =>{
        operationService.save({...data, strategy: STRATEGY})
            .then(data => console.log('data',data))
            .catch(err => {
                console.log('err',err)
            })
        
        setTimeout(() => {
            process.exit(0)    
        }, 3000);
        
    })
    
    
    // if( rsi < 30 && !isOpened ){
    //     console.log('Sobrevendido, hora de comprar');
    //     isOpened = true
    //     saveEnvVariable('IS_OPENED', isOpened);
    //     content += `Comprar\n\n`
    //     newOrder(SYMBOL, QUANTITY, SIDE.BUY)
    //         .then(data => operationService.save({...data, strategy: STRATEGY}))
    //         .catch(err => errorService.save({...err, strategy: STRATEGY}))
    //     save(content)

    // }else if( rsi > 70 && isOpened ){
    //     console.log('Sobrecomprado, hora de Vender');
    //     content += `Vender\n\n`
    //     newOrder(SYMBOL, QUANTITY, SIDE.SELL)
    //             .then(data => operationService.save({...data, strategy: STRATEGY}))
    //             .catch(err => errorService.save({...err, strategy: STRATEGY}))
    //     save(content)
    //     isOpened = false
    //     saveEnvVariable('IS_OPENED', isOpened);
    // }else{
    //     console.log('Aguardar');
        
    // }
    
}


//setInterval(start,3000)
const startRSI = () => {
    const job = new CronJob(
        '*/3 * * * * *',
        async () => {
            start()
        },
        null, // onComplete
        true, // start
        'America/Sao_Paulo' // ajuste para seu fuso horário
    
    )
}

startRSI()
module.exports = startRSI