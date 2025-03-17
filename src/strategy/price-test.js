
const { CronJob } = require('cron')
const axios = require('axios')
const { format } = require('date-fns')


const operationService = require('../core/services/operation.service')

const newOrder = require('../utils/order')

const calculateProfit = require('../utils/calculateProfit')
const balanceService = require('../core/services/balance.service')

const telegram = require('../utils/telegram')
const UserService = require('../core/services/user.service')
const strategyService = require('../core/services/strategy.service')

const SIDE = {BUY: 'BUY', SELL: 'SELL'}
const STRATEGY = 'PRICE'
const { IS_OPENED_PRICE } = process.env
//const API_URL = 'https://testnet.binance.vision'; //https://api.binance.com

let isOpened = IS_OPENED_PRICE == 'true'
let lastBuyOrder = null;

const start = strategy => {
    return new Promise(async(resolve,reject)=> {
        
        console.clear()
        const symbol = strategy.symbol
        const buyPrice = strategy.buyPrice
        const sellPrice = strategy.sellPrice
        const quantity = strategy.quantity
        const production = strategy.url.includes('api')
        console.log('Estratégia PRECO');
        const { data } = await axios.get(`${strategy.url}/api/v3/klines?limit=100&interval=15m&symbol=${symbol}`)
        
        
        const candle = data[ data.length - 1 ]
        const price = parseFloat( candle[4] ) 
        console.log("Data", format(new Date, 'dd/MM/yyyy HH:mm:ss'));
        console.log("Price", price);
        console.log('ja comprei', isOpened);
        console.log('BUY_PRICE', buyPrice);
        console.log('SELL_PRICE', sellPrice);
        
        const valueBuy = await newOrder.newOrder(symbol, quantity, SIDE.BUY, strategy)
        
        lastBuyOrder = valueBuy
        const _price = valueBuy.fills[0].price
        const qtd = valueBuy.executedQty
        const total = parseFloat(_price * qtd).toFixed(2)
        console.log('Compra');
        console.log('Preço',_price);
        console.log('Qtde',qtd);
        console.log('Total',total);
        const save1 = await operationService.create({...valueBuy, userId: strategy.userId, strategy: STRATEGY})
        console.log('save1',save1);
        
        
        
        const valueSell = await newOrder.newOrder(symbol, quantity, SIDE.SELL, strategy)
        if( lastBuyOrder ){
            const profitResult = calculateProfit(lastBuyOrder, valueSell);
            console.log('Venda');
            console.log('preço de compra',`$${profitResult.buyPrice.toFixed(2)}`)
            console.log('preço de venda',`$${profitResult.sellPrice.toFixed(2)}`)
            console.log('quntidade',`$${profitResult.quantity}`)
            console.log('Lucro/prejuizo',`$${profitResult.profit.toFixed(2)}`)
            console.log('Percentual',`$${profitResult.percentageProfit.toFixed(2)}`)
            balanceService.create({...profitResult,userId: strategy.userId, production })
            
            lastBuyOrder = null
            
            
        }
        
        await operationService.create({...valueSell, userId: strategy.userId, strategy: STRATEGY})
        
        setTimeout(() => {
            process.exit(0)
        }, 2000);
        
    })
    
    
}



//setInterval(start,3000)

const startPrice = async () => {
    
    require('../config/database/init')

    const job = new CronJob(
        '*/10 * * * * *',
        async () => {
            UserService.getApproved()
            .then(async resp => {
                resp.forEach(async _u => {
                    const u = _u.dataValues
                    telegram.setSetChatId( u.chatId )
                    
                    const strategy = await strategyService.find({userId: u.id, strategy: 'PRICE', active: true})
                    
                    strategy.forEach(element => {
                        isOpened = element.isOpened
                        
                        start(element)
                        .then(()=>console.log('Operaçao realizada'))
                        .catch(e=> {
                            console.log('Falha',e.message);
                            job.stop()
                            setTimeout(() => {
                                startPrice()
                            }, 5000);
                        })
                        
                    });
                    
                })
                
            })
        },
        null, // onComplete
        true, // start
        'America/Sao_Paulo' // ajuste para seu fuso horário
        
    )
    
    
}


module.exports = {startPrice, start}