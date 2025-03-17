const OperationRepository = require("../repository/OperationRepository")
const FillService = require('./fill.service')
const BaseService = require("./base.service")
class OperationRSIService extends BaseService{

    constructor(repository){
        super(repository)
    }

    create(data){
        return new Promise((resolve, reject)=>{
            super.create(data)
                 .then(async resp => {
                    console.log('resp', resp);
                    
                    const fills = data.fills.map(f => ({operationId: resp.id, ...f}))
                    await FillService.bulkCreate(fills)
                    resolve(resp)
                 })
        })
    }
}

module.exports = new OperationRSIService(OperationRepository)