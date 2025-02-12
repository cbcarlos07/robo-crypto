const OperationRepository = require("../repository/OperationRepository")
class OperationRSIService {

    save(data){
        return OperationRepository.save(data)
    }
}

module.exports = new OperationRSIService()