class BaseService{
    
    constructor(_repository){
        this.repository = _repository
    }

    save(data){
        return this.repository.save(data)
    }
}

module.exports = BaseService