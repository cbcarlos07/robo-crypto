const {format} = require('date-fns')
class Repository {

    constructor(model){
        this.model = model
    }

    save(data){
        const date = format(new Date(), "dd/MM/yyyy HH:mm:ss") 
        const info = new this.model( {...data, date} )
        return info.save(  )
    }
}

module.exports = Repository