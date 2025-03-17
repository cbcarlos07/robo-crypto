
class Repository {

    constructor(_model){
        this.model = _model
    }

    create(data){
        return this.model.create(data)
    }

    bulkCreate(data){
        return this.model.bulkCreate(data)
    }

    update(id, data){
        return this.model.update(data, {where: id})
    }

    delete(id){
        return this.model.destroy({where: {id}})
    }

    findById(id){
        return this.model.findByPk(id)
    }

    findAll(params){
        return this.model.findAll({...params})
    }
    
    findOne(data){
        const {params, _include} = data
        const where = params ? params : {}
        const include = _include ? _include : null
        return this.model.findOne({where, include})
    }

    getTotal(params = null){
        return this.model.count(params)
    }

    paginate(param){
        const {name, page, limit, field, _include, _order, additionalParam} = param
        const curpage = ( page - 1 ) * limit
        const _params = name ? { [field]: {[Op.like]: `%${name}%`}, ...additionalParam } : {...additionalParam}
        const include = _include ? _include : []
        const order = _order ? _order : field ? [field] : []
        const params =  _params
        
        
        return this.model.findAndCountAll({
            where: {
                ...params
            },
            include,
            limit,
            offset: curpage,
            order
        })
    }

   
}

module.exports = Repository