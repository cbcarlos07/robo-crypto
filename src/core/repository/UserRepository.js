const model = require("../../models/user");
const Repository = require("./Repository");

class UserRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new UserRepository(model)