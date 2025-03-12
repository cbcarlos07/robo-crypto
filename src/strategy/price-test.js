
const { CronJob } = require('cron')
const axios = require('axios')
const { format } = require('date-fns')

const connect = require('../config/db/connection')
const operationService = require('../core/services/operation.service')

const newOrder = require('../utils/order')

const calculateProfit = require('../utils/calculateProfit')
const balanceService = require('../core/services/balance.service')

const telegram = require('../utils/telegram')
const UserService = require('../core/services/user.service')
const strategyService = require('../core/services/strategy.service')

const SYMBOL = 'BTCUSDT'
const BUY_PRICE = 97142
const SELL_PRICE = 98003
const QUANTITY = '0.001'
const SIDE = {BUY: 'BUY', SELL: 'SELL'}
const STRATEGY = 'PRICE'
const { IS_OPENED_PRICE, API_URL } = process.env
//const API_URL = 'https://testnet.binance.vision'; //https://api.binance.com

let isOpened = IS_OPENED_PRICE == 'true'
let lastBuyOrder = null;

const start = (strategy,user) => {
    return new Promise(async(resolve,reject)=> {
        
        console.clear()
        const symbol = strategy.symbol
        const buyPrice = strategy.buyPrice
        const sellPrice = strategy.sellPrice
        const quantity = strategy.quantity
        
        console.log('Estratégia PRECO');
        const { data } = await axios.get(`${user.url}/api/v3/klines?limit=100&interval=15m&symbol=${symbol}`)
        
        
        const candle = data[ data.length - 1 ]
        const price = parseFloat( candle[4] ) 
        console.log("Data", format(new Date, 'dd/MM/yyyy HH:mm:ss'));
        console.log("Price", price);
        console.log('ja comprei', isOpened);
        console.log('BUY_PRICE', buyPrice);
        console.log('SELL_PRICE', sellPrice);
        
        const valueBuy = await newOrder.newOrder(symbol, quantity, SIDE.BUY, user)
        
        lastBuyOrder = valueBuy
        const _price = valueBuy.fills[0].price
        const qtd = valueBuy.executedQty
        const total = parseFloat(_price * qtd).toFixed(2)
        console.log('Compra');
        console.log('Preço',_price);
        console.log('Qtde',qtd);
        console.log('Total',total);
        const save1 = await operationService.save({...valueBuy, userId: strategy.userId, strategy: STRATEGY})
        console.log('save1',save1);
        
        
        
        const valueSell = await newOrder.newOrder(symbol, quantity, SIDE.SELL, user)
        if( lastBuyOrder ){
            const profitResult = calculateProfit(lastBuyOrder, valueSell);
            console.log('Venda');
            console.log('preço de compra',`$${profitResult.buyPrice.toFixed(2)}`)
            console.log('preço de venda',`$${profitResult.sellPrice.toFixed(2)}`)
            console.log('quntidade',`$${profitResult.quantity}`)
            console.log('Lucro/prejuizo',`$${profitResult.profit.toFixed(2)}`)
            console.log('Percentual',`$${profitResult.percentageProfit.toFixed(2)}`)
            balanceService.save({...profitResult,userId: strategy.userId })
            
            lastBuyOrder = null
            
            
        }
        
        await operationService.save({...valueSell, userId: strategy.userId, strategy: STRATEGY})
        
        setTimeout(() => {
            process.exit(0)
        }, 2000);
        
    })
    
    
}



//setInterval(start,3000)

const startPrice = async () => {
    
    connect()
    .then(() => {
        console.log('Conectado ao MongoDB!');
        const job = new CronJob(
            '*/10 * * * * *',
            async () => {
                UserService.getApproved()
                .then(async resp => {
                    resp.forEach(async u => {
                        telegram.setSetChatId( u.chatId )
                        
                        const strategy = await strategyService.find({userId: u._id, strategy: 'PRICE', active: true})
                        
                        strategy.forEach(element => {
                            isOpened = element.isOpened
                            
                            
                            console.log('user', u);
                            
                            start(element, u)
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
        
    }).catch(e => {
        
        console.error('Erro ao conectar ao MongoDB:', e.message);
        console.log('Tentaremos depois de 1 minuto');
        
        setTimeout(() => {
            console.log('Tentando novamente');
            startPrice()
        }, 5000);
    })
    
    
    
}


module.exports = {startPrice, start}