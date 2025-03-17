const repository = require("../repository/FillRepository")
const BaseService = require("./base.service")

class FillService extends BaseService {

    constructor(repository){
        super(repository)
    }

}

module.exports = new FillService(repository)