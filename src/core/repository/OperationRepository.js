const operation = require("../../models/operation");
const Repository = require("./Repository");

class OperationRSIRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new OperationRSIRepository(operation)