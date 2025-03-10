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

    update(id, data){
        return this.model.findByIdAndUpdate(
            id,
            {
                $set: data
            },
            { new: true }
        );
        
    }

    findById(id){
        return this.model.findById(id);
    }

    find(data){
        return this.model.find(data);
    }
    
    findOne(data){
        return this.model.findOne(data);
    }
    
    delete(data){
        return this.model.deleteOne(data)
    }

    findOneAndUpdate(data){
        console.log('findOneAndUpdate data',data);
        
        return this.model.findOneAndUpdate(
            { ...data.valueFind }, 
            { $setOnInsert: { 
                ...data.value,
                ...data.valueFind  
                } 
            },
            { 
                upsert: true,
                new: true
            }
        )
    }
}

module.exports = Repository