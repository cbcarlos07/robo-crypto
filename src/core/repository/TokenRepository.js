const model = require("../../config/db/model/token");
const Repository = require("./Repository");

class TokenRepository extends Repository{
    constructor(model){
        super(model)
    }
}

module.exports = new TokenRepository(model)