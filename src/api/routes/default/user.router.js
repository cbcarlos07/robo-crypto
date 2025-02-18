const userController = require("../../controllers/user.controller");
const BaseRouter = require("../base.router");

class UserRouter extends BaseRouter{
    prefix = '/user'
    constructor(_controller){
        super(_controller)
    }

    init(){
        super.init()
        this.router.patch(`${this.prefix}/auth`, this.controller.auth.bind( this.controller ))

        return this.router
    }

}

module.exports = new UserRouter( userController )