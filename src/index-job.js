require('dotenv').config()

const {startPrice} = require('./strategy/price')
const startRSI = require('./strategy/rsi')
const telegram = require('./utils/telegram')

const param = process.argv[2]
//node src rsi
//npm run rsi
//node src price
//npm run price
telegram.start()
switch (param) {
    case 'rsi':
        startRSI()
        break;
    case 'price':
        startPrice()
        break;
    case 'balance':
        getBalance()
        break    
    

    default:
        startRSI()
        startPrice()
        break;
}


// startPrice()

// startRSI()