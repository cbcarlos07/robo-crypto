const repository = require("../repository/BalanceRepository")
class BalanceService {

    save(data){
        return repository.save(data)
    }
}

module.exports = new BalanceService()