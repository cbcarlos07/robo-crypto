const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PWD, MONGO_DB, MONGO_URL } = process.env
const url = MONGO_URL.replace('user',MONGO_USER)
                     .replace('pwd', MONGO_PWD)
                     .replace('database',MONGO_DB)
const MONGODB_URI = `mongodb://localhost:27017/${MONGO_DB}`

mongoose.set('strictQuery', false); // Preparar para a mudança futura

// Conectar ao MongoDB
const connect = () => {
    return mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

module.exports = connect


