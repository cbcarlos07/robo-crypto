const repository = require("../repository/BalanceRepository")
const BaseService = require("./base.service")

class BalanceService extends BaseService {

    constructor(repository){
        super(repository)
    }

    sum(){
        return this.repository.sum()
    }
}

module.exports = new BalanceService(repository)