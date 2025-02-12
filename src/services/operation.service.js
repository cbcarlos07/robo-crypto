const OperationRepository = require("../repository/OperationRepository")
class OperationService {

    save(data){
        return OperationRepository.save(data)
    }
}

module.exports = new OperationService()