const mongoose = require('mongoose');
// Definindo um modelo
const errorSchema = new mongoose.Schema({
    code: { type: Number },
    msg: { type: String },
    date: { type: String },
    // Adicione outros campos conforme necessário
});

// Criar o modelo
module.exports = mongoose.model('Error', errorSchema);