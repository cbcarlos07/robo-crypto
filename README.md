# Bot crypto

Este robô foi baseado na semana [BotDev 2025](https://www.luiztools.com.br/bot-dev-1.html#videos)

O código original da semana está [aqui](https://github.com/luiztools/imersao-botdev-2025)

Com esse robô é possível trabalhar com duas estratégias

RSI e Preço


## Documentação de algumas rotas

    http://localhost:3000/api-docs/#/

Para acessar crie seus dados 

    LOGIN=
    SENHA=

no arquivo .env


## Comandos Sequelize

Para criar o banco de dados:

    npx sequelize db:create

Para criar as tabelas digite o comando:

    npx sequelize db:migrate

    npx sequelize migration:create --name create_table_profile

Para rodar o projeto

Na primeira vez:

    npm run start:db

Esse comando executa o banco, cria as tabelas e já inicia alguns dados

Para reiniciar o banco o comando é:

    npm run restart:db

Criar seeder

npx sequelize seed:generate --name article_price

Rodar seed específico

npx sequelize-cli db:seed --seed 20231207165843-insert_article.js

npx sequelize-cli db:seed:all
