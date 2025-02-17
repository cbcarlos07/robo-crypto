

const axios = require('axios')
const { CronJob } = require('cron')
const { format } = require('date-fns')

const connect = require('../config/db/connection')
const operationService = require('../core/services/operation.service')
const { saveEnvVariable } = require('../utils/file')
const newOrder = require('../utils/order')
const errorService = require('../core/services/error.service')
const calculateProfit = require('../utils/calculateProfit')
const balanceService = require('../core/services/balance.service')
const prepareMsg = require('../utils/prepareMsg')
const telegram = require('../utils/telegram')
const UserService = require('../core/services/user.service')

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
const start = () => {
    return new Promise(async(resolve,reject)=> {

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
                    const conteMsg = `
            Compra
            Preço: $${_price}
            Quantidade: $${qtd}
            Total: ${total}
            `
                    telegram.sendMessage( conteMsg )
                    operationService.save({...data, strategy: STRATEGY})
                        .then(d => {
                            console.log('salvou operacao', d)
                            resolve({})
                        })
                })
                .catch(err => {
                    errorService.save({...err, strategy: STRATEGY})
                    reject({})
                })
    
            //await operationService.save( {...obj, side: SIDE.BUY} )
        }else if( price >= SELL_PRICE && isOpened ){
            console.log('Vender');
            isOpened = false
            saveEnvVariable('IS_OPENED_PRICE', isOpened);
            newOrder.newOrderStrategyPrice(SYMBOL, QUANTITY, SIDE.SELL)
                .then(async data => {
                    if( lastBuyOrder ){
                        const profitResult = calculateProfit(lastBuyOrder, data);
                        const content = prepareMsg(profitResult)
                        telegram.sendMessage(content)
                        console.log('Venda');
                        console.log('preço de compra',`$${profitResult.buyPrice.toFixed(2)}`)
                        console.log('preço de venda',`$${profitResult.sellPrice.toFixed(2)}`)
                        console.log('quntidade',`$${profitResult.quantity}`)
                        console.log('Lucro/prejuizo',`$${profitResult.profit.toFixed(2)}`)
                        console.log('Percentual',`$${profitResult.percentageProfit.toFixed(2)}`)
                        balanceService.save(profitResult)
                        
                        lastBuyOrder = null
                    }    
                    await operationService.save({...data, strategy: STRATEGY})
                    resolve({})
                })
                .catch(err => {
                    errorService.save({...err, strategy: STRATEGY})
                    reject({})
                })
        }else{
            console.log('Aguardar');
            resolve({})
            
        }
    })
    
    
}


//setInterval(start,3000)

const startPrice = async () => {
    connect()
    .then(() => {
        console.log('Conectado ao MongoDB!');
        UserService.getApproved()
            .then(resp => {
                console.log('resp',resp);
                
                const job = new CronJob(
                    '*/3 * * * * *',
                    async () => {
                        start()
                          .then(()=>console.log('Operaçao realizada'))
                          .catch(()=> {
                            console.log('Falha');
                            job.stop()
                            setTimeout(() => {
                                startPrice()
                            }, 5000);
                          })
                    },
                    null, // onComplete
                    true, // start
                    'America/Sao_Paulo' // ajuste para seu fuso horário
                
                )
            })
        
      }).catch(e => {

          console.error('Erro ao conectar ao MongoDB:', e.message);
          console.log('Tentaremos depois de 1 minuto');
          
          setTimeout(() => {
              console.log('Tentando novamente');
              startPrice()
          }, 5000);
      })
    
}


module.exports = startPrice