const repository = require("../repository/StrategyRepository")
const BaseService = require("./base.service")
const userService = require("./user.service")

class StrategyService extends BaseService{

    constructor(repository){
        super(repository)
    }

    find(data){
        return new Promise((resolve, reject)=>{
            super.find(data).then(async res => {
                const result = res.map(async l => {
                    const user = await userService.findById(l.userId)
                    
                    const list = {...l, user}
                    const _user = {...user}
                    delete _user._doc.password
                    const obj = {...list._doc, user: {..._user._doc}}
                    return obj
                })
                
                const rows = await Promise.all( result )
                resolve(rows)
            }).catch(e => reject(e))
        })
        
        
    }
}

module.exports = new StrategyService(repository)