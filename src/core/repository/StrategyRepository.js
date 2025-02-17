const model = require("../../config/db/model/strategy");
const Repository = require("./Repository");

class StrategyRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new StrategyRepository(model)