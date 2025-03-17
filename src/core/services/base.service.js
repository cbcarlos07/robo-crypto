class BaseService{
    
    constructor(_repository){
        this.repository = _repository
    }

    create(data){
        return this.repository.create(data)
    }

    bulkCreate(data){
        return this.repository.bulkCreate(data)
    }

    update(id, data){
        return this.repository.update(id, data)
    }

    findById(id){
        return this.repository.findById(id);
    }

    find(data){
        return this.repository.findAll(data);
    }

    findAll(data){
        return this.repository.findAll(data);
    }
    
    findOne(data){
        return this.repository.findOne(data);
    }

    delete(id){
        return this.repository.delete(id)
    }

    getTotal(params = null){
        return this.repository.getTotal(params)
    }

    pagination(params, paramsTotal = null){
        return new Promise(async(resolve, reject)=>{
            try {
                const total = await this.getTotal(paramsTotal)
                const result = await this.repository.paginate(params)
                const {page, limit} = params
                resolve({
                    page,
                    total,
                    totalPage: calculateTotalPages(total, limit),
                    rows: result.rows
                })
                
            } catch (error) {
                reject(error)
            }
        })
    }

    paginate(params){
        return this.pagination(params)
    }
}

module.exports = BaseService