const repository = require("../repository/StrategyRepository")
const BaseService = require("./base.service")
class StrategyService extends BaseService{

    constructor(repository){
        super(repository)
    }
}

module.exports = new StrategyService(repository)