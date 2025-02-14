const mongoose = require('mongoose');
// Definindo um modelo
const operationSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    orderId: { type: Number, required: true },
    clientOrderId: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: String },
    side: { type: String },
    type: { type: String },
    executedQty: { type: Number },
    strategy: {type: String},
    date: {type: String},
    fills: { type: Array, default: [] },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});

// Criar o modelo
module.exports = mongoose.model('Operation', operationSchema);