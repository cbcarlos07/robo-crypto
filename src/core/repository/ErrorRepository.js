const model = require("../../models//error");
const Repository = require("./Repository");

class ErrorRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new ErrorRepository(model)