
const crypto = require('crypto')
const { format } = require('date-fns')
const { default: axios } = require('axios')

const { save, errorFn } = require('../utils/file')


//const API_URL = 'https://testnet.binance.vision' //'https://testnet.binance.vision'; //https://api.binance.com

const newOrder = (symbol, quantity, side, strategy) => {
    return new Promise(async (resolve, reject)=>{
        const user = strategy._user
        const order = {symbol, quantity, side}
        order.type = 'MARKET'
        order.timestamp = await getBinanceServerTime(user)
    
        const signature = crypto
                            .createHmac('sha256', strategy.secretKey )
                            .update( new URLSearchParams(order).toString() )
                            .digest('hex')
    
        order.signature = signature
    
        try {
            const { data } = await axios.post(
                                        `${strategy.url}/api/v3/order`,
                                        new URLSearchParams(order).toString(),
                                        {
                                            headers: {'X-MBX-APIKEY' : strategy.apiKey}
                                        }
                                    )
            
            const date = format(new Date(), "dd/MM/yyyy HH:mm:ss") 
            save( `${JSON.stringify( {...data, date},null, 2 )}\n\n` )
            resolve({...data, date})
        } catch (error) {
            const date = format(new Date(), "dd/MM/yyyy HH:mm:ss") 
            //console.log('deu erro', date);
            //console.log('deu erro', error);
            //console.log('deu erro', error.response.data);
            let content = `Data: ${date}\n`
            content += `${JSON.stringify( error.response.data, null, 2 )}\n\n`
            errorFn({...content, date})
            reject( error.response.data )
        }
        
    })
}






const getBinanceServerTime = async user => {
    try {
      const response = await axios.get(`${user.url}/api/v3/time`);
      return response.data.serverTime;
    } catch (error) {
      console.error('Erro ao obter timestamp da Binance:', error);
      return Date.now();
    }
  }



module.exports = {newOrder}