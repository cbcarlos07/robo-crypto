require('dotenv').config()
const telegram = require('./utils/telegram')
const {startPrice} = require('./strategy/price')
const startRSI = require('./strategy/rsi')
const server = require('./server')

const SERVER_PORT = process.env.SERVER_PORT

server.listen(SERVER_PORT, () => {
    console.log(`API is running on [port ${SERVER_PORT}]`);
    telegram.start()
    //startPrice()
    //startRSI()
  });