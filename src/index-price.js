const axios = require('axios')

const SYMBOL = 'BTCUSDT'
const BUY_PRICE = 97142
const SELL_PRICE = 98003

const API_URL = 'https://testnet.binance.vision'; //https://api.binance.com

let isOpened = false

const start = async () => {

    const { data } = await axios.get(`${API_URL}/api/v3/klines?limit=21&interval=15m&symbol=${SYMBOL}`)
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