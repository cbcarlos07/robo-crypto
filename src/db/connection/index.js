const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PWD, MONGO_DB } = process.env
const MONGODB_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@cluster0.jwaei.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false); // Preparar para a mudança futura

// Conectar ao MongoDB
const connect = () => {
    return mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

module.exports = connect


