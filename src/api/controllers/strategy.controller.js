const service = require("../../core/services/strategy.service");
const BaseController = require("./base.controller");

class StrategyController extends BaseController{
    constructor(service){
        super(service)
    }

}

module.exports = new StrategyController( service )

