
const fs = require('fs')
const path = require('path')
const logTxt =  path.resolve('log','log.txt')
const errorTxt =  path.resolve('log','error.txt')
const envFilePath = path.join('.env');

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

// Função para salvar uma variável no arquivo .env
const saveEnvVariable = (key, value) => {
    const envVariable = `${key}=${value}\n`;
    
    // Verifica se a variável já existe no arquivo .env
    fs.readFile(envFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Erro ao ler o arquivo .env: ${err}`);
            return;
        }

        // Verifica se a variável já existe no arquivo
        const regex = new RegExp(`^${key}=.*`, 'm');
        if (regex.test(data)) {
            // Se a variável já existe, substitui
            const newData = data.replace(regex, envVariable);
            fs.writeFile(envFilePath, newData, 'utf8', (err) => {
                if (err) console.error(`Erro ao salvar a variável: ${err}`);
                else console.log(`Variável ${key} atualizada com sucesso.`);
            });
        } else {
            // Se a variável não existe, adiciona ao final
            fs.appendFile(envFilePath, envVariable, (err) => {
                if (err) console.error(`Erro ao adicionar a variável: ${err}`);
                else console.log(`Variável ${key} adicionada com sucesso.`);
            });
        }
    });
};

module.exports = {save, errorFn, saveEnvVariable}
