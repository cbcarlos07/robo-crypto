const UnauthorizeError = require("../../config/Errors/UnauthorizeError");
const userService = require("../../core/services/user.service");
const BaseController = require("./base.controller");
const token = process.env.TOKEN
class UserController extends BaseController{
    constructor(service){
        super(service)
    }

    

    auth(req, res, next){
        userService.auth({...req.body, origin: req.headers.origin })
                   .then(resp => {
                        res.status(this.StatusCodes.OK).json(resp)
                   }).catch(e => {
                     //next({status: e.statusCode ? e.statusCode : 500, message: e.message })
                     next(new UnauthorizeError(e.message));
                   })
    }

}

module.exports = new UserController( userService )

