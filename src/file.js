
const fs = require('fs')
const path = require('path')
const logTxt =  path.resolve('log','log.txt')
const errorTxt =  path.resolve('log','error.txt')

const save = content => {
    fs.appendFile(logTxt, content, (err) => {
        if (err) {
            console.error('Erro ao escrever o arquivo:', err);
        } else {
            console.log('Arquivo salvo com sucesso!');
        }
    });
}

const errorFn = content => {
    fs.appendFile(errorTxt, content, (err) => {
        if (err) {
            console.error('Erro ao escrever o arquivo:', err);
        } else {
            console.log('Arquivo salvo com sucesso!');
        }
    });
}

module.exports = {save, errorFn}
