const DefaultError = require( "./interface/DefaultError" );

module.exports = class UnauthorizeError extends DefaultError {
    static status = 403;
    static title = "Unauthorize";
    static json = false;
}