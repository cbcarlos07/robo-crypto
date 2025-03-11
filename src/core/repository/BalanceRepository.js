const model = require("../../config/db/model/balance");
const Repository = require("./Repository");

class BalanceRSIRepository extends Repository{
    constructor(model){
        super(model)
    }

    sum(userId){
        return this.model.aggregate([
              {
                $match: {
                    userId
                }
            },
            {
              $group: {
                _id: null,
                totalProfit: { $sum: '$profit' },
                totalPercentageProfit: { $sum: '$percentageProfit' },
                totalItems: { $sum: 1 }
              }
            }
          ]
        )
    }
}

module.exports = new BalanceRSIRepository(model)