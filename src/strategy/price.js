
const { CronJob } = require('cron')
const axios = require('axios')
const { format } = require('date-fns')

const operationService = require('../core/services/operation.service')

const newOrder = require('../utils/order')
const errorService = require('../core/services/error.service')
const calculateProfit = require('../utils/calculateProfit')
const balanceService = require('../core/services/balance.service')
const prepareMsg = require('../utils/prepareMsg')
const telegram = require('../utils/telegram')
const UserService = require('../core/services/user.service')
const strategyService = require('../core/services/strategy.service')


const SIDE = {BUY: 'BUY', SELL: 'SELL'}
const STRATEGY = 'PRICE'

//const API_URL = 'https://testnet.binance.vision'; //https://api.binance.com

let isOpened = false
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
        console.log("-- Data", format(new Date, 'dd/MM/yyyy HH:mm:ss'));
        console.log("-- Price", price);
        console.log('-- ja comprei', isOpened);
        console.log('-- BUY_PRICE', buyPrice);
        console.log('-- SELL_PRICE', sellPrice);
        
        
        
        
        if( price <= buyPrice && !isOpened ){
            console.log('----------------------------------------------');
            
            console.log('Comprar');
            console.log('price <= buyPrice && !isOpened');
            console.log(`${price} <= ${buyPrice} && ${isOpened}`);
            isOpened = true
            console.log('isOpened',isOpened);
            
            const strategyUpdated = await strategyService.update({id: strategy.id}, {isOpened})
            console.log('strategyUpdated', strategyUpdated);
            
            
            
            newOrder.newOrder(symbol, quantity, SIDE.BUY, strategy)
            .then(valueBuy => {
                lastBuyOrder = valueBuy
                const _price = valueBuy.fills[0].price
                const qtd = valueBuy.executedQty
                const total = parseFloat(_price * qtd).toFixed(2)
                console.log('Compra');
                console.log('Preço _price',_price);
                console.log('Preço _price', typeof _price);
                console.log('Qtde',qtd);
                console.log('Total',total);
                const conteMsg = `
Compra - *PRICE*
Preço: *$${Number(_price).toFixed(2)}*
Quantidade: *${qtd}*
Total: *${total}*
            `
                telegram.sendMessage( conteMsg )
                operationService.create({...valueBuy, userId: strategy.userId, strategy: STRATEGY})
                .then(d => {
                    console.log('salvou operacao', d)
                    resolve({})
                })
            })
            .catch(err => {
                errorService.create({...err, strategy: STRATEGY})
                reject(err)
            })
            
            //await operationService.create( {...obj, side: SIDE.BUY} )
            console.log('----------------------------------------------');
        }else if( price >= sellPrice && isOpened ){
            console.log('----------------------------------------------');
            console.log('Vender');
            console.log(`price >= sellPrice && isOpened`);
            console.log(`${price} >= ${sellPrice} && ${isOpened}`);
            console.log('isOpened',isOpened);
            isOpened = false
            console.log('isOpened',isOpened);
            
            const strategyUpdated = await strategyService.update({id: strategy.id}, {isOpened})
            console.log('strategyUpdated', strategyUpdated);
            newOrder.newOrder(symbol, quantity, SIDE.SELL, strategy)
            .then(async data => {
                if( lastBuyOrder ){
                    const profitResult = calculateProfit(lastBuyOrder, data);
                    const content = prepareMsg({...profitResult, strategy: 'PRICE'})
                    telegram.sendMessage(content)
                    console.log('Venda');
                    console.log('preço de compra',`$${profitResult.buyPrice.toFixed(2)}`)
                    console.log('preço de venda',`$${profitResult.sellPrice.toFixed(2)}`)
                    console.log('quntidade',`$${profitResult.quantity}`)
                    console.log('Lucro/prejuizo',`$${profitResult.profit.toFixed(2)}`)
                    console.log('Percentual',`$${profitResult.percentageProfit.toFixed(2)}`)
                    balanceService.create({...profitResult, userId: strategy.userId, production})
                    
                    lastBuyOrder = null
                }    
                await operationService.create({...data, strategy: STRATEGY})
                resolve({})
            })
            .catch(err => {
                errorService.create({...err, userId: strategy.userId, strategy: STRATEGY})
                reject(err)
            })
            console.log('----------------------------------------------');
        }else{
            console.log('----------------------------------------------');
            console.log('Aguardar');
            console.log('----------------------------------------------');
            resolve({})
            
        }
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