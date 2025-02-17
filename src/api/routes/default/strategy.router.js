const controller = require("../../controllers/strategy.controller");
const BaseRouter = require("../base.router");

class StrategyRouter extends BaseRouter{
    prefix = '/strategy'
    constructor(_controller){
        super(_controller)
    }

}

module.exports = new StrategyRouter( controller )