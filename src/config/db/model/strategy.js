const mongoose = require('mongoose');
// Definindo um modelo
const strategySchema = new mongoose.Schema({    
    strategy: {type: String},
    isOpened: {type: Boolean},
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Nome do modelo referenciado 
    }
});

// Criar o modelo
module.exports = mongoose.model('Strategy', strategySchema);