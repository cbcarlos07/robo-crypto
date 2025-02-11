const axios = require('axios')
const {format} = require('date-fns')

const SYMBOL = 'BTCUSDT'
const PERIOD = 14

const API_URL = 'https://api.binance.com' //'https://testnet.binance.vision'; //https://api.binance.com

let isOpened = false

const averages = (prices, period, startIndex = 1) => {
    let gains = 0
    let losses = 0
    //console.log('period', period);
    //console.log('length', prices.length);
    
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
        //console.log('newAvarages',newAvarages);
        
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

    const { data } = await axios.get(`${API_URL}/api/v3/klines?limit=100&interval=15m&symbol=${SYMBOL}`)
    const candle = data[ data.length - 1 ]
    const lastPrice = parseFloat( candle[4] ) 
    console.clear()
    console.log(format(new Date(), "dd/MM/yyyy HH:mm:ss"));
    
    console.log("Price", lastPrice);
    //console.log('data',data);
    //process.exit()
    const prices = data.map(k => parseFloat( k[ 4 ] ))
    //console.log('prices', prices);
    
    const rsi = RSI(prices, PERIOD)
    console.log('RSI', rsi);
    
    
    if( rsi < 30 && !isOpened ){
        console.log('Sobrevendido, hora de comprar');
        isOpened = true
    }else if( rsi > 70 && isOpened ){
        console.log('Sobrecomprado, hora de Vender');
        isOpened = false
    }else{
        console.log('Aguardar');
        
    }
    
    
}

setInterval(start,3000)