const model = require("../../config/db/model/error");
const Repository = require("./Repository");

class ErrorRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new ErrorRepository(model)