
const crypto = require('crypto')
const { save, errorFn } = require('../file')
const { format } = require('date-fns')
const { default: axios } = require('axios')
const API_URL = 'https://testnet.binance.vision' //'https://testnet.binance.vision'; //https://api.binance.com

const { API_KEY, SECRET_KEY } = process.env

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
            resolve(data)
        } catch (error) {
            const date = format(new Date(), "dd/MM/yyyy HH:mm:ss") 
            console.log('deu erro', date);
            console.log('deu erro', error);
            console.log('deu erro', error.response.data);
            let content = `Data: ${date}\n`
            content += `${JSON.stringify( error.response.data, null, 2 )}\n\n`
            errorFn(content)
            reject( error.response.data )
        }
        
    })
}

const getExchangeInfo = async (symbol) => {
    try {
        const { data } = await axios.get(`${API_URL}/api/v3/exchangeInfo?symbol=${symbol}`)
        return data.symbols[0].filters
    } catch (error) {
        console.error('Erro ao obter informações do par:', error)
        throw error
    }
}

// Função para ajustar a quantidade de acordo com as regras
const adjustQuantity = (quantity, lotSize) => {
    const minQty = parseFloat(lotSize.minQty)
    const maxQty = parseFloat(lotSize.maxQty)
    const stepSize = parseFloat(lotSize.stepSize)
    
    // Ajusta para o stepSize
    quantity = Math.floor(quantity / stepSize) * stepSize
    
    // Limita entre min e max
    quantity = Math.max(minQty, Math.min(maxQty, quantity))
    
    // Ajusta casas decimais
    const decimals = lotSize.stepSize.indexOf('1') - 1
    return quantity.toFixed(Math.max(decimals, 0))
}


const newOrderPrice = async (symbol, price, side, quoteOrderQty) => {
    try {
        // Obtém as regras do par
        const filters = await getExchangeInfo(symbol)
        const lotSize = filters.find(f => f.filterType === 'LOT_SIZE')
        
        // Calcula e ajusta a quantidade
        let quantity = quoteOrderQty / price
        quantity = adjustQuantity(quantity, lotSize)

        console.log('Quantidade ajustada:', quantity)

        const order = {
            symbol: symbol,
            side: side,
            type: 'LIMIT',
            timeInForce: 'GTC',
            quantity: quantity,
            price: price.toFixed(2),
            timestamp: Date.now()
        }

        const signature = crypto
            .createHmac('sha256', SECRET_KEY)
            .update(new URLSearchParams(order).toString())
            .digest('hex')

        order.signature = signature

        console.log('Enviando ordem:', order)

        const { data } = await axios.post(
            `${API_URL}/api/v3/order`,
            new URLSearchParams(order).toString(),
            {
                headers: { 'X-MBX-APIKEY': API_KEY }
            }
        )
        return data
    } catch (error) {
        console.error('Erro detalhado:', error.response ? error.response.data : error)
        throw error.response ? error.response.data : error
    }
}

const newOrderStrategyPrice = (symbol, quantity, side) => {
    return new Promise(async(resolve, reject)=>{

        const data = {
            symbol,
            side,
            quantity,
            type: 'MARKET',
            timestamp: Date.now(),
            recvWindow: 60000
        }
    
        const signature = crypto
                                .createHmac('sha256', SECRET_KEY)
                                .update(`${new URLSearchParams(data)}`)
                                .digest('hex')
    
        const newData = {...data, signature}
 
        try {            
            const result = await axios.post(
                                    `${API_URL}/api/v3/order`,
                                    new URLSearchParams(newData).toString(),
                                    {
                                        headers: {'X-MBX-APIKEY' : API_KEY}
                                    }
            )
            console.log(result.data);
            resolve(result.data)
        } catch (error) {
            console.error('error',error)
            reject(error.response.data)
            
        }
    })

}




module.exports = {newOrderPrice, newOrderStrategyPrice, newOrder}