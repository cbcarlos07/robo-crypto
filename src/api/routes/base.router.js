const router = require('express').Router()

class BaseRouter {
    
    constructor(controller){
        this.controller = controller
        this.prefix = '/'
        this.router = router
    }

    init(){
        this.router.post(`${this.prefix}`, this.controller.save.bind(this.controller))
        this.router.put(`${this.prefix}/:id`, this.controller.update.bind(this.controller))
        this.router.get(`${this.prefix}/:id`, this.controller.findById.bind(this.controller))
        this.router.patch(`${this.prefix}`, this.controller.find.bind(this.controller))
        
        return this.router
    }
}

module.exports = BaseRouter