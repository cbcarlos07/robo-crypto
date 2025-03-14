const { ObjectId } = require("mongodb");
const service = require("../../core/services/balance.service");
const BaseController = require("./base.controller");

class BalanceController extends BaseController{
    constructor(service){
        super(service)
    }

    getBalance(req, res, next){
        const {userId} =  req.params
        console.log('--->getBalance',userId);
        const objectId = new ObjectId(userId)
        this.service
            .sum( objectId )
            .then(resp => {
                console.log('---->getBalance resp', resp);
                
                res.status(this.StatusCodes.OK).json( resp )
            }).catch(err => {
                next({...err, status: 500, message: err.message})
            })
    }

}

module.exports = new BalanceController( service )

