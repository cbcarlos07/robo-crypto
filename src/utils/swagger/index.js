const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const package = require('../../../package.json')
const basicAuth = require('express-basic-auth');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Robô cripto',
      version: package.version,
    },
  },
  apis: ['./src/utils/swagger/routes/*.js'], // files containing annotations as above
  tags: [
    {
      name: 'init'
    },
    {
      name: 'users'
    },
    {
      name: 'strategy'
    }
],
};


const swaggerSpec = swaggerJsdoc(options);

// Configurações de autenticação
const users = {
  'cbcarlos': 'brito1985' // Defina o usuário e a senha aqui
};

router.use(basicAuth({
  users: users,
  challenge: true, // Isso fará com que o navegador mostre um prompt de autenticação
  unauthorizedResponse: 'Você precisa fornecer credenciais válidas para acessar a documentação.'
}));


router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router