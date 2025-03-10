const { StatusCodes } = require("http-status-codes");
const BaseRouter = require("../base.router");
const userController = require('../../controllers/user.controller')
const initController = require('../../controllers/init.controller')
const pkg = require('../../../../package.json')

class InitRouter extends BaseRouter{
    
    init(){
        this.router.get(this.prefix, (req, res)=>{
            res.status(StatusCodes.OK)
               .json({
                description: pkg.description,
                name: pkg.name,
                version: pkg.version
               })
        })
        this.router.post(`/create`, initController.save.bind( initController ))
        this.router.patch(`/auth`, userController.auth.bind( userController ))

        return this.router
    }
}

module.exports = new InitRouter()