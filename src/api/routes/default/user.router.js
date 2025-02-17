const userController = require("../../controllers/user.controller");
const BaseRouter = require("../base.router");

class UserRouter extends BaseRouter{
    prefix = '/user'
    constructor(_controller){
        super(_controller)
    }

}

module.exports = new UserRouter( userController )