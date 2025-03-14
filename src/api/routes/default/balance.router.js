const controller = require("../../controllers/balance.controller");
const BaseRouter = require("../base.router");

class StrategyRouter extends BaseRouter{
    prefix = '/balance'
    constructor(controller){
        super(controller)
    }

    init(){
        super.init()
        this.router.get(`${this.prefix}/:userId/user`, this.controller.getBalance.bind( this.controller ))
        return this.router
    }

}

module.exports = new StrategyRouter( controller )