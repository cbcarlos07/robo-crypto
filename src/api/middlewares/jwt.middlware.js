const jwt = require('jsonwebtoken');
const ConfigSingleton = require('../../utils/ConfigSingleton');

const jwtMiddleware = (deps) => {
  return async (req, res, next) => {
    
    const isExcluded = deps.exclusions.some(exclusion => {
      if( req.url === '/' ) return true      
      return req.url.startsWith(exclusion) && exclusion != '/';
    });
    
    if (!isExcluded) {
      //const token = req.headers['x-access-token']
      const token = ConfigSingleton.get('token') ? ConfigSingleton.get('token') : req.headers['x-access-token']
      if (!token) {
        //res.status(403).json({error: 'Token não fornecido'})
        next({status: 403, message: 'Token não fornecido'})
        return false
      }

      try {
        req.decoded = jwt.verify(token, process.env.JWT_SECRET)
      } catch (error) {
        //res.status(403).json({ error: 'Falha ao autenticar o token' })
        next({status: 403, message: 'Falha ao autenticar o token'})
        return false
      }
    }
    next()
  }
}

module.exports = jwtMiddleware