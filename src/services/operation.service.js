const OperationRepository = require("../repository/OperationRepository")
const BaseService = require("./base.service")
class OperationRSIService extends BaseService{

    constructor(repository){
        super(repository)
    }
}

module.exports = new OperationRSIService(OperationRepository)