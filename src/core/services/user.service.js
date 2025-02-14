const UserRepository = require("../repository/UserRepository")
const BaseService = require("./base.service")
class UserService extends BaseService{

    constructor(repository){
        super(repository)
    }
}

module.exports = new UserService(UserRepository)