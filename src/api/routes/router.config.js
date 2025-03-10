const requireDir = require('require-dir');
const path = require('path');
const swagger = require('../../utils/swagger')
const rotas = requireDir('./default', {
    filter: fullPath => {
        return path.basename(fullPath) !== 'index.js';
    },
});



const API = '/api'
const VERSAO1 = '/v1'

const PREFIXv1 = `${API}`

const fnRouterConfig = deps => {
    const {app} = deps
    
    app.use('/api-docs', swagger)

    Object.values(rotas)
        .map( (r, i) => {
            if( r.prefix === '/' )
                app.use('/', r.init())
            else{
                app.use(`${PREFIXv1}`, r.init())
            }
          })
   
}

module.exports = fnRouterConfig