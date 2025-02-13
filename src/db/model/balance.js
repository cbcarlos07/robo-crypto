const mongoose = require('mongoose');
// Definindo um modelo
const balanceSchema = new mongoose.Schema({
    buyPrice: {type: Number},
    sellPrice: {type: Number},
    quantity: {type: Number},
    buyTotal: {type: Number},
    sellTotal: {type: Number},
    profit: { type: Number, index: true },
    percentageProfit: { type: Number, index: true }

});

// Criar o modelo
module.exports = mongoose.model('Balance', balanceSchema);