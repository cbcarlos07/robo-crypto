const axios = require('axios')

const SYMBOL = 'BTCUSDT'
const PERIOD = 14

const API_URL = 'https://testnet.binance.vision'; //https://api.binance.com

let isOpened = false

const average = (prices, period, startIndex) => {
    let gains = 0
    let losses = 0

    for (let index = 0; period && (index + startIndex) < prices.length; index++) {
        const element = array[index];
        const diff = prices[ index + startIndex] - prices[ index + startIndex - 1 ]
        if( diff >= 0 ){
            gains += diff
        }else{
            losses += Math.abs( diff )
        }
    }

    let avgGains = gains / period
    let avgLosses = losses / period
}

const start = async () => {

    const { data } = await axios.get(`${API_URL}/api/v3/klines?limit=100&interval=15m&symbol=${SYMBOL}`)
    const candle = data[ data.length - 1 ]
    const price = parseFloat( candle[4] ) 
    console.clear()
    console.log("Price", price);
    
    if( price <= BUY_PRICE && !isOpened ){
        console.warn('Comprar');
        isOpened = true
    }else if( price >= SELL_PRICE && isOpened ){
        console.log('Vender');
        isOpened = false
    }else{
        console.log('Aguardar');
        
    }
    
    
}

setInterval(start,3000)