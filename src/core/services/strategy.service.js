const repository = require("../repository/StrategyRepository")
const BaseService = require("./base.service")
const userService = require("./user.service")

class StrategyService extends BaseService{

    constructor(repository){
        super(repository)
    }

    find(data){
        
        const params = {
            where: data,
            include: [{association: '_user'}]
        }
        return super.find(params)
        
    }
}

module.exports = new StrategyService(repository)