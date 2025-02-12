const operation = require("../db/model/operation");
const Repository = require("./Repository");

class OperationRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new OperationRepository(operation)