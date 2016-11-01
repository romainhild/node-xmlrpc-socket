var Client = require('./client')
  , CustomType = require('./customtype')
  , dateFormatter = require('./date_formatter')

var xmlrpc = exports

/**
 * Creates an XML-RPC client.
 *
 * @param {String} host
 * @param {Number} port
 * @return {Client}
 * @see Client
 */
xmlrpc.createClient = function(host, port) {
    return new Client(host, port)
}

xmlrpc.CustomType = CustomType
xmlrpc.dateFormatter = dateFormatter
