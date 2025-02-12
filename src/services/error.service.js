const ErrorRepository = require("../repository/ErrorRepository")

class ErrorService {

    save(data){
        return ErrorRepository.save(data)
    }
}

module.exports = new ErrorService()