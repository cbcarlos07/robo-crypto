const md5 = require("md5")
const jwt = require('jsonwebtoken')
const UserRepository = require("../repository/UserRepository")
const BaseService = require("./base.service")

const ConfigSingleton = require('../../utils/ConfigSingleton')
const { JWT_SECRET } = process.env
class UserService extends BaseService{
    
    constructor(repository){
        super(repository)
    }
    
    save(data){
        data.password = md5( data.password )
        return super.save( data )
    }
    
    getApproved(){
        const params = {
            where: {approved: true}
        }
        return super.find(params)
    }
    
    auth ( data ) {
        return new Promise(async(resolve, reject)=>{
    
            let msg = 'Login ou senha inválidos'
            let statusCode = 400
            let status = false
            let token = undefined
            let refreshToken = undefined
            
            data.password = md5(data.password)
            
            const respEmail = await this.findOne({
                            $or: [
                                { email: data.username },
                                { username: data.username }
                            ],
                            password: data.password
                        })
                
             
            
            let obj = {}
            if( respEmail ){
                const {name, email, username}= respEmail
                obj = {name, email, username} 
                statusCode = 200
                status = true                    
                token = jwt.sign( obj, JWT_SECRET  )
                refreshToken = jwt.sign( obj, JWT_SECRET, { expiresIn: '7d' }  )
                msg = undefined
            }
            
            if( respEmail ){
                //await this.update({id: respEmail.id}, {refreshToken})                
                ConfigSingleton.set('token', token)
            
                resolve({statusCode, status, data: obj, token, refreshToken, msg})
            }else{
                reject({message: msg, statusCode: 403})
            }
        })
    }
    
}

module.exports = new UserService(UserRepository)