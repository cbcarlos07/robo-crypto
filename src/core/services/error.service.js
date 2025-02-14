const ErrorRepository = require("../repository/ErrorRepository")
const BaseService = require("./base.service")

class ErrorService extends BaseService{

    constructor(repository){
        super(repository)
    }
}

module.exports = new ErrorService(ErrorRepository)