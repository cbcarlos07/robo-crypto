
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

module.exports = newOrder