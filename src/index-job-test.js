require('dotenv').config()

const {startPrice} = require('./strategy/price-test')
const startRSI = require('./strategy/rsi-test')
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
    default:
        startRSI()
        startPrice()
        break;
}


// startPrice()

// startRSI()