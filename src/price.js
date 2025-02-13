
require('dotenv').config()
const axios = require('axios')
const { CronJob } = require('cron')

const connect = require('./db/connection')
const operationService = require('./services/operation.service')
const { saveEnvVariable } = require('./file')
const newOrder = require('./utils/order')
const errorService = require('./services/error.service')
const { format } = require('date-fns')
const calculateProfit = require('./utils/calculateProfit')
const balanceService = require('./services/balance.service')

connect()
const SYMBOL = 'BTCUSDT'
const BUY_PRICE = 97142
const SELL_PRICE = 98003
const QUANTITY = '0.001'
const SIDE = {BUY: 'BUY', SELL: 'SELL'}
const STRATEGY = 'PRICE'
const { IS_OPENED_PRICE } = process.env
const API_URL = 'https://testnet.binance.vision'; //https://api.binance.com

let isOpened = IS_OPENED_PRICE == 'true'
let lastBuyOrder = null;
const start = async () => {
    console.clear()
    console.log('Estratégia PRECO');
    const { data } = await axios.get(`${API_URL}/api/v3/klines?limit=100&interval=15m&symbol=${SYMBOL}`)
    //console.log('data',data);
    
    const candle = data[ data.length - 1 ]
    const price = parseFloat( candle[4] ) 
    console.log("Data", format(new Date, 'dd/MM/yyyy HH:mm:ss'));
    console.log("Price", price);
    console.log('ja comprei', isOpened);
    console.log('BUY_PRICE', BUY_PRICE);
    console.log('SELL_PRICE', SELL_PRICE);
    
    // const valueBuy = await newOrder.newOrder(SYMBOL, QUANTITY, SIDE.BUY)

    // lastBuyOrder = valueBuy
    // const _price = valueBuy.fills[0].price
    // const qtd = valueBuy.executedQty
    // const total = parseFloat(_price * qtd).toFixed(2)
    // console.log('Compra');
    // console.log('Preço',_price);
    // console.log('Qtde',qtd);
    // console.log('Total',total);
    // const save1 = await operationService.save({...valueBuy, strategy: STRATEGY})
    // console.log('save1',save1);
    
    // console.log('lastBuyOrder',lastBuyOrder);
    
            
    // const valueSell = await newOrder.newOrder(SYMBOL, QUANTITY, SIDE.SELL)
    // if( lastBuyOrder ){
    //     const profitResult = calculateProfit(lastBuyOrder, valueSell);
    //     console.log('Venda');
    //     console.log('preço de compra',`$${profitResult.buyPrice.toFixed(2)}`)
    //     console.log('preço de venda',`$${profitResult.sellPrice.toFixed(2)}`)
    //     console.log('quntidade',`$${profitResult.quantity}`)
    //     console.log('Lucro/prejuizo',`$${profitResult.profit.toFixed(2)}`)
    //     console.log('Percentual',`$${profitResult.percentageProfit.toFixed(2)}`)
    //     balanceService.save(profitResult)
        
    //     lastBuyOrder = null
        

    // }
                
    // await operationService.save({...valueSell, strategy: STRATEGY})
    
    // setTimeout(() => {
    //     process.exit(0)
    // }, 2000);
            

            
    
    if( price <= BUY_PRICE && !isOpened ){
        console.warn('Comprar');
        isOpened = true
        saveEnvVariable('IS_OPENED_PRICE', isOpened);
        newOrder.newOrder(SYMBOL, QUANTITY, SIDE.BUY)
            .then(data => {
                lastBuyOrder = valueBuy
                const _price = valueBuy.fills[0].price
                const qtd = valueBuy.executedQty
                const total = parseFloat(_price * qtd).toFixed(2)
                console.log('Compra');
                console.log('Preço',_price);
                console.log('Qtde',qtd);
                console.log('Total',total);
                operationService.save({...data, strategy: STRATEGY})
                    .then(d => console.log('salvou operacao', d))
            })
            .catch(err => errorService.save({...err, strategy: STRATEGY}))

        //await operationService.save( {...obj, side: SIDE.BUY} )
    }else if( price >= SELL_PRICE && isOpened ){
        console.log('Vender');
        isOpened = false
        saveEnvVariable('IS_OPENED_PRICE', isOpened);
        newOrder.newOrderStrategyPrice(SYMBOL, QUANTITY, SIDE.SELL)
            .then(data => {
                if( lastBuyOrder ){
                    const profitResult = calculateProfit(lastBuyOrder, data);
                    console.log('Venda');
                    console.log('preço de compra',`$${profitResult.buyPrice.toFixed(2)}`)
                    console.log('preço de venda',`$${profitResult.sellPrice.toFixed(2)}`)
                    console.log('quntidade',`$${profitResult.quantity}`)
                    console.log('Lucro/prejuizo',`$${profitResult.profit.toFixed(2)}`)
                    console.log('Percentual',`$${profitResult.percentageProfit.toFixed(2)}`)
                    balanceService.save(profitResult)
                    
                    lastBuyOrder = null
                }    
                operationService.save({...data, strategy: STRATEGY})
            })
            .catch(err => errorService.save({...err, strategy: STRATEGY}))
    }else{
        console.log('Aguardar');
        
    }
    
    
}


//setInterval(start,3000)

const startPrice = () => {
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



startPrice()
module.exports = startPrice