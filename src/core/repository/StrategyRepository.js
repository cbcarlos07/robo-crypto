const model = require("../../models/strategy");
const Repository = require("./Repository");

class StrategyRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new StrategyRepository(model)