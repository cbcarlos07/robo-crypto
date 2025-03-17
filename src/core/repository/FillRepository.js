const model = require("../../models/fill");
const Repository = require("./Repository");

class FillRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new FillRepository(model)