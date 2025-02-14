const { StatusCodes } = require("http-status-codes")
class BaseController {
    constructor(service){
        this.service = service
        this.StatusCodes = StatusCodes
    }

    save(req,res,next){
        this.service.save(req.body)
                    .then(resp => {
                        res.status(this.StatusCodes.CREATED).json({data: resp, msg: this.messages.created})
                    })
                    .catch(err => {
                        next({...err, status: 500, message: err.message})
                    })
    }

    update(req,res,next){
        return this.service.update(id, req.body)
        .then(() => {
             res.status(this.StatusCodes.OK).json({msg: this.messages.updated})
        })
        .catch(err => {
             next({...err, message: err.message, status: 500})
        })
    }

    findById(req,res,next){
        const { id } = req.params
        this.service.findById(id)
                            .then(resp => {
                                res.status(this.StatusCodes.OK).json(resp)
                            })
                            .catch(err => {
                                next({...err, message: err.message, status: 500})
                            })
    }

    find(req,res,next){
        this.service.find(req.body)
                    .then(resp => {
                        res.status(this.StatusCodes.OK).json(resp)
                    })
                    .catch(err => {
                        next({...err, message: err.message, status: 500})
                    })
    }
}

module.exports = BaseController