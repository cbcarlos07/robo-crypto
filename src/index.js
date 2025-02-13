require('dotenv').config()

const startPrice = require('./price')
const startRSI = require('./rsi')

startPrice()
console.log('------');

startRSI()