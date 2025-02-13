const mongoose = require('mongoose');
// Definindo um modelo
const balanceSchema = new mongoose.Schema({
    buyPrice: {type: Number},
    sellPrice: {type: Number},
    quantity: {type: Number},
    buyTotal: {type: Number},
    sellTotal: {type: Number},
    profit: {type: Number},
    percentageProfit: {type: Number}

});

// Criar o modelo
module.exports = mongoose.model('Balance', balanceSchema);