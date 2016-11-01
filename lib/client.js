var net = require('net');
var Readable = require('stream').Readable; 
var Serializer = require('./serializer');
var Deserializer = require('./deserializer');

/**
 * Creates a Client object for making XML-RPC method calls via socket
 *
 * @constructor
 * @param {String} host              host to connect
 * @param {Number} port              port to connect
 * @return {Client}
 */
function Client(host, port) {
    // Invokes with new if called without
    if (false === (this instanceof Client)) {
  	return new Client(host, port)
    }

    this.host = host;
    this.port = port;
}

/**
 * Makes an XML-RPC call to the server specified by the constructor's options.
 *
 * @param {String} method     - The method name.
 * @param {Array} params      - Params to send in the call.
 * @param {Function} callback - function(error, value) { ... }
 *   - {Object|null} error    - Any errors when making the call, otherwise null.
 *   - {mixed} value          - The value returned in the method response.
 */
Client.prototype.methodCall = function methodCall(method, params, callback) {
    var that = this;
    that.stream = new Readable;
    that.stream._read = function noop() {};
    // connect the socket
    that.socket = net.connect(that.port, that.host, function() {
	that.socket.setEncoding('UTF8');
	// get the string of the methodCall
	var xml = Serializer.serializeMethodCall(method, params, null);
	
	var length = 0;
	var head = [
    	    'CONTENT_LENGTH' + String.fromCharCode(0) + xml.length + String.fromCharCode(0),
    	    'SCGI' + String.fromCharCode(0) + '1' + String.fromCharCode(0)
	];
	head.forEach(function (item) {
    	    length += item.length;
	});
	
	that.socket.write(length + ':');
	head.forEach(function (item) {
    	    that.socket.write(item);
	}, that);
	
	that.socket.write(',');
	that.socket.write(xml);
    });
    
    // set the listener
    that.socket.on('error', function(err) {
	console.log('receive error: ' + err);
    	callback(err, null);
    });
    that.socket.on('data', function(data) {
	that.stream.push(data);
    });
    that.socket.on('end', function() {
	var deserializer = new Deserializer();
	that.stream.push(null);
    	deserializer.deserializeMethodResponse(that.stream, callback);
    });

}

module.exports = Client

