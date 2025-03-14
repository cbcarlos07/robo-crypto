const repository = require("../repository/BalanceRepository")
const BaseService = require("./base.service")

class BalanceService extends BaseService {

    constructor(repository){
        super(repository)
    }

    sum(id){
        console.log('sum',id);
        
        return this.repository.sum(id)
    }
}

module.exports = new BalanceService(repository)