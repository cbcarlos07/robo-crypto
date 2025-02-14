const model = require("../../config/db/model/user");
const Repository = require("./Repository");

class UserIRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new UserIRepository(model)