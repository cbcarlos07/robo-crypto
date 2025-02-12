require('dotenv').config()
const axios = require('axios')
const { CronJob } = require('cron')
const operationService = require('./services/operation.service')
const { saveEnvVariable } = require('./file')
const newOrder = require('./utils/order')
const errorService = require('./services/error.service')
const { format } = require('date-fns')

const SYMBOL = 'BTCUSDT'
const BUY_PRICE = 97142
const SELL_PRICE = 98003
const QUANTITY = '0.001'
const SIDE = {BUY: 'BUY', SELL: 'SELL'}
const STRATEGY = 'PRICE'
const { IS_OPENED_PRICE } = process.env
const API_URL = 'https://testnet.binance.vision'; //https://api.binance.com

let isOpened = false

const start = async () => {
    isOpened = IS_OPENED_PRICE == 'true'
    const { data } = await axios.get(`${API_URL}/api/v3/klines?limit=100&interval=15m&symbol=${SYMBOL}`)
    //console.log('data',data);
    
    const candle = data[ data.length - 1 ]
    const price = parseFloat( candle[4] ) 
    console.clear()
    console.log("Data", format(new Date, 'dd/MM/yyyy HH:mm:ss'));
    console.log("Price", price);
    console.log('ja comprei', isOpened);
    console.log('BUY_PRICE', BUY_PRICE);
    console.log('SELL_PRICE', SELL_PRICE);
    

    if( price <= BUY_PRICE && !isOpened ){
        console.warn('Comprar');
        isOpened = true
        saveEnvVariable('IS_OPENED_PRICE', isOpened);
        newOrder(SYMBOL, QUANTITY, SIDE.BUY)
            .then(data => {
                operationService.save({...data, strategy: STRATEGY})
                    .then(d => console.log('salvou operacao', d))
            })
            .catch(err => errorService.save({...err, strategy: STRATEGY}))

        //await operationService.save( {...obj, side: SIDE.BUY} )
    }else if( price >= SELL_PRICE && isOpened === true){
        console.log('Vender');
        isOpened = false
        saveEnvVariable('IS_OPENED_PRICE', isOpened);
        newOrder(SYMBOL, QUANTITY, SIDE.SELL)
            .then(data => operationService.save({...data, strategy: STRATEGY}))
            .catch(err => errorService.save({...err, strategy: STRATEGY}))
    }else{
        console.log('Aguardar');
        
    }
    
    
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