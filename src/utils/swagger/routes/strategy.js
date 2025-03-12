/**
 * @openapi
 * components:
 *   schemas:
 *     StrategyBase:
 *       type: object
 *       required:
 *         - strategy
 *         - isOpened
 *         - quantity
 *         - symbol
 *         - userId
 *       properties: 
 *         strategy: 
 *           type: string
 *           description: Nome da estratégia
 *           example: PRICE
 *           enum: [PRICE, RSI]
 *         isOpened: 
 *           type: boolean
 *           description: Status da estratégia
 *           example: false
 *         quantity: 
 *           type: string
 *           description: Quantidade a ser negociada
 *           example: 0.001
 *         symbol: 
 *           type: string  
 *           description: Símbolo da moeda
 *           example: BTCUSDT
 *         userId:
 *           type: string
 *           description: Id do usuario
 *           example: 67b4e238ea078d279a373f86
 *         active:
 *           type: boolean
 *           description: status da estratégia
 *           example: true
 *     PriceStrategy:
 *       required: [buyPrice, sellPrice]
 *       properties:
 *         buyPrice: 
 *           type: number  
 *           description: Preço a ser comprado
 *           example: 97142
 *         sellPrice: 
 *           type: number  
 *           description: Preço de venda
 *           example: 98003
 *     RsiStrategy:
 *       required: [period]
 *       properties:
 *         period:
 *           type: number
 *           description: Periodo a ser comparado (para estratégia RSI)
 *           example: 14
 *     StrategyRequest:
 *       title: Corpo da requisição
 *       allOf:
 *         - $ref: '#/components/schemas/StrategyBase'
 *         - oneOf:
 *           - $ref: '#/components/schemas/PriceStrategy'
 *           - $ref: '#/components/schemas/RsiStrategy'
 */

/**
 * @openapi
 * /strategy:
 *   get:
 *     description: Acessa as estratégias salvas 
 *     responses:
 *       200:
 *         description: Retorna a lista de usuários
 *     tags: 
 *     - strategy
 *   post:
 *     description: Realiza o cadastro de da estratégia
 *     requestBody:
 *      content:
 *         application/json:
 *          schema:
 *            $ref: '#/components/schemas/StrategyRequest'
 *     responses:
 *       200:
 *         description: Retorna os dados do cadastrados
 *     tags: 
 *     - strategy
 * /strategy/{id}:
 *   put:
 *     description: Realiza a atualização do cadastro da estratégia
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: Id do usuário
 *       schema:
 *        type: string   
 *     requestBody:
 *      content:
 *         application/json:
 *          schema:
 *            $ref: '#/components/schemas/StrategyRequest'
 *     responses:
 *       200:
 *         description: Retorna a mensagem de feedback
 *     tags: 
 *     - strategy
 *   delete:
 *     description: Remove uma estratégia específica
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
 *     - strategy
 */
