const model = require("../../models/balance");
const Repository = require("./Repository");

class BalanceRSIRepository extends Repository{
    constructor(model){
        super(model)
    }

    sum(userId){
      Balance.findAll({
        attributes: [
            'production',
            'userId',
            [Sequelize.fn('SUM', Sequelize.col('profit')), 'totalProfit'],
            [Sequelize.fn('SUM', Sequelize.col('percentageProfit')), 'totalPercentageProfit']
        ],
        where: {userId},
        group: ['production', 'userId'], // Agrupando por production e userId
        raw: true // Para obter resultados sem a estrutura do modelo
    });
    }
}

module.exports = new BalanceRSIRepository(model)