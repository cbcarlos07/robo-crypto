const model = require("../db/model/balance");
const Repository = require("./Repository");

class BalanceRSIRepository extends Repository{
    constructor(model){
        super(model)
    }

    sum(){
        return this.model.aggregate([
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