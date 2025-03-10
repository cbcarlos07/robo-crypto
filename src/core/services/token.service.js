const repository = require("../repository/TokenRepository")
const BaseService = require("./base.service")
class TokenService extends BaseService{

    constructor(repository){
        super(repository)
    }
}

module.exports = new TokenService(repository)