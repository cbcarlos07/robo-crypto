const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PWD } = process.env
const MONGODB_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@cluster0.jwaei.mongodb.net/bot-crypto?retryWrites=true&w=majority&appName=Cluster0`

// Conectar ao MongoDB
const connect = () => {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Conectado ao MongoDB!');
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });
}

module.exports = connect


