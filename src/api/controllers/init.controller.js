const service = require("../../core/services/user.service");
const BaseController = require("./base.controller");

class InitController extends BaseController{
    constructor(service){
        super(service)
    }

    save(req,res,next){
        const tokenAccess = req.headers['x-access-token']
        if( token === tokenAccess ){
            this.service.save(req.body)
                        .then(resp => {
                            res.status(this.StatusCodes.CREATED).json({data: resp, msg: this.messages.created})
                        })
                        .catch(err => {
                            next({...err, status: 500, message: err.message})
                        })
        }else{
            next({message: 'Você não tem permissão para realizar esta operação', status: 400})
        }
        
        
    }

}

module.exports = new InitController( service )

