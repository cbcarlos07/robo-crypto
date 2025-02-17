class BaseService{
    
    constructor(_repository){
        this.repository = _repository
    }

    save(data){
        return this.repository.save(data)
    }

    update(id, data){
        return this.repository.update(id, data)
    }

    findById(id){
        return this.repository.findById(id);
    }

    find(data){
        return this.repository.find(data);
    }

    delete(data){
        return this.repository.delete(data)
    }
}

module.exports = BaseService