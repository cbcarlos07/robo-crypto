const model = require("../db/model/balance");
const Repository = require("./Repository");

class BalanceRSIRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new BalanceRSIRepository(model)