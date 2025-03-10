/**
 * @openapi
 * /:
 *   get:
 *     description: Mostra os dados da aplicação
 *     responses:
 *       200:
 *         description: Retorna informações de configuração
 *     tags: 
 *     - init
 * /auth:
 *   patch:
 *     description: Realiza o login na aplicação
 *     requestBody:
 *      content:
 *         application/json:
 *          schema:
 *             title: Corpo da requisição
 *             type: object
 *             properties: 
 *               username: 
 *                 type: string
 *                 description: Nome de usuário
 *                 example: cbcarlos
 *               password: 
 *                 type: string  
 *                 description: Senha do usuário
 *                 example: brito1985
 *     responses:
 *       200:
 *         description: Retorna os dados do acesso
 *     tags: 
 *     - init
 * /create:
 *   post:
 *     description: Realiza o cadastro de usuarios
 *     requestBody:
 *      content:
 *         application/json:
 *          schema:
 *             title: Corpo da requisição
 *             type: object
 *             properties: 
 *               name: 
 *                 type: string
 *                 description: Nome do usuário
 *                 example: Seu Nome
 *               username: 
 *                 type: string
 *                 description: Nome de usuário
 *                 example: seuusuario
 *               email: 
 *                 type: string
 *                 description: E-mail do usuário
 *                 example: seuusuario@email.com
 *               password: 
 *                 type: string  
 *                 description: Senha do usuário
 *                 example: 123456789
 *               phone: 
 *                 type: string  
 *                 description: Telefone do usuário DDD91234-4567
 *                 example: 99999999999
 *               agree: 
 *                 type: boolean  
 *                 description: Aceite no acordo
 *                 example: true
 *               approved: 
 *                 type: boolean  
 *                 description: Se foi aprovado para usar o software
 *                 example: true
 *               dtApproved: 
 *                 type: string
 *                 description: Data da aprovação
 *                 example: 2025-03-10
 *               apiKey: 
 *                 type: string
 *                 description: Api key da binance 
 *                 example: 2TO5XBYYGRNa6szJhWxGeqaZG6T7FQPoaxTTubPsqCm7GRfWVU47XEL7XBYP0=
 *               secretKey: 
 *                 type: string
 *                 description: Secret key da binance 
 *                 example: 2TO5XBYYGRNa6szJhWxGeqaZG6T7FQPoaxTTubPsqCm7GRfWVU47XEL7XBYP0=
 *               obs: 
 *                 type: string
 *                 description: Alguma observação
 *                 example: Qualquer texto
 *               chatId: 
 *                 type: string
 *                 description: Id do chat no telegram
 *                 example: 123458
 *     parameters:
 *     - name: x-access-token
 *       in: header
 *       required: true
 *       description: Token de autorização do usuário
 *       schema:
 *        type: string    
 *     responses:
 *       200:
 *         description: Retorna os dados do cadastrados
 *     tags: 
 *     - init
 */