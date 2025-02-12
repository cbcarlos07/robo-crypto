require('dotenv').config()
const axios = require('axios')
const {format} = require('date-fns')
const crypto = require('crypto')
const { CronJob } = require('cron')

const {save, errorFn} = require('./file')
const operationService = require('./services/operation.service')
const connect = require('./db/connection')
const errorService = require('./services/error.service')

connect()

const { API_KEY, SECRET_KEY } = process.env

const SYMBOL = 'BTCUSDT'
const PERIOD = 14
const QUANTITY = '0.001'
const SIDE = {BUY: 'BUY', SELL: 'SELL'}
const API_URL = 'https://testnet.binance.vision' //'https://testnet.binance.vision'; //https://api.binance.com

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


const newOrder = (symbol, quantity, side) => {
    return new Promise(async (resolve, reject)=>{

        const order = {symbol, quantity, side}
        order.type = 'MARKET'
        order.timestamp = Date.now()
    
        const signature = crypto
                            .createHmac('sha256', SECRET_KEY )
                            .update( new URLSearchParams(order).toString() )
                            .digest('hex')
    
        order.signature = signature
    
        try {
            const { data } = await axios.post(
                                        `${API_URL}/api/v3/order`,
                                        new URLSearchParams(order).toString(),
                                        {
                                            headers: {'X-MBX-APIKEY' : API_KEY}
                                        }
                                    )
            console.log(data);
            save( `${JSON.stringify( data,null, 2 )}\n\n` )
            await operationService.save( data )
        } catch (error) {
            const date = format(new Date(), "dd/MM/yyyy HH:mm:ss") 
            console.log('deu erro', date);
            console.log('deu erro', error.response.data);
            let content = `Data: ${date}\n`
            content += `${JSON.stringify( error.response.data, null, 2 )}\n\n`
            errorFn(content)
            await errorService.save( error.response.data )
        }
        resolve({})
    })
}

const start = async () => {
    let content = ''
    const { data } = await axios.get(`${API_URL}/api/v3/klines?limit=100&interval=15m&symbol=${SYMBOL}`)
    const candle = data[ data.length - 1 ]
    const lastPrice = parseFloat( candle[4] ) 
    //console.clear()
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
    
    
    // newOrder(SYMBOL, QUANTITY, SIDE.SELL).then(() =>{
    //     process.exit(0)
    // })
    
    
    if( rsi < 30 && !isOpened ){
        console.log('Sobrevendido, hora de comprar');
        isOpened = true
        content += `Comprar\n\n`
        newOrder(SYMBOL, QUANTITY, SIDE.BUY)
        save(content)

    }else if( rsi > 70 && isOpened ){
        console.log('Sobrecomprado, hora de Vender');
        content += `Vender\n\n`
        newOrder(SYMBOL, QUANTITY, SIDE.SELL)
        save(content)
        isOpened = false
    }else{
        console.log('Aguardar');
        
    }
    
    
    console.log('');
    
}

const job = new CronJob(
    '*/3 * * * * *',
    async () => {
        start()
    },
    null, // onComplete
    true, // start
    'America/Sao_Paulo' // ajuste para seu fuso horário

)
//setInterval(start,3000)