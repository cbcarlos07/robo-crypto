/**
 * @openapi
 * /user:
 *   get:
 *     description: Acessar a lista de usuários
 *     responses:
 *       200:
 *         description: Retorna a lista de usuários
 *     tags: 
 *     - users
 *   post:
 *     description: Realiza o cadastro de usuario
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
 *     responses:
 *       200:
 *         description: Retorna os dados do cadastrados
 *     tags: 
 *     - users
 * /user/{id}:
 *   get:
 *     description: Acessar um usuário específico
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: Id do usuário
 *       schema:
 *        type: string   
 *     responses:
 *       200:
 *         description: Retorna um objeto contendo o usuario caso encontre
 *     tags: 
 *     - users
 *   put:
 *     description: Realiza a atualização de usuario
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
 *     - name: id
 *       in: path
 *       required: true
 *       description: Id do usuário
 *       schema:
 *        type: string   
 *     responses:
 *       200:
 *         description: Retorna os dados do atualizado
 *     tags: 
 *     - users
 *   delete:
 *     description: Remove um usuário específico
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: Id do usuário
 *       schema:
 *        type: string   
 *     responses:
 *       200:
 *         description: Retorna uma mensagem de sucesso
 *     tags: 
 *     - users
 */