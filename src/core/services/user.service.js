const md5 = require("md5")
const UserRepository = require("../repository/UserRepository")
const BaseService = require("./base.service")
class UserService extends BaseService{

    constructor(repository){
        super(repository)
    }

    save(data){
        data.password = md5( data.password )
        return super.save( data )
    }

    getApproved(){
        const params = {
            approved: true
        }

        return super.find(params)
    }
}

module.exports = new UserService(UserRepository)