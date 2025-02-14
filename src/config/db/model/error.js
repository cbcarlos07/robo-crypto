const mongoose = require('mongoose');
// Definindo um modelo
const errorSchema = new mongoose.Schema({
    code: { type: Number },
    msg: { type: String },
    date: { type: String },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Criar o modelo
module.exports = mongoose.model('Error', errorSchema);