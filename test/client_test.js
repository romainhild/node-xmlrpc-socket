var vows   = require('vows')
  , assert = require('assert')
  , http   = require('http')
  , Client = require('../lib/client')
, fs     = require('fs')
var net = require('net');

const VALID_RESPONSE = fs.readFileSync(__dirname + '/fixtures/good_food/string_response.xml')
const BROKEN_XML = fs.readFileSync(__dirname + '/fixtures/bad_food/broken_xml.xml')

vows.describe('Client').addBatch({
    //////////////////////////////////////////////////////////////////////
    // Test Constructor functionality
    //////////////////////////////////////////////////////////////////////
    'A constructor with host and port' : {
    	topic: function () {
    	    var server = net.createServer();
    	    server.listen(9001, '127.0.0.1');
    	    var client = new Client('127.0.0.1', 9001);
    	    return client;
    	},
    	'contains the right host and port' : function (topic) {
    	    assert.deepEqual({port: topic.port, host: topic.host}, { port: 9001, host: '127.0.0.1' })
    	}
    },

    //////////////////////////////////////////////////////////////////////
    // Test method call functionality
    //////////////////////////////////////////////////////////////////////
    'A method call' : {
    	'with an invalid socket' : {
    	    topic: function () {
    		var client = new Client('127.0.0.1', 9002);
    		client.methodCall('getArray', null, this.callback);
    	    },
	    'contains an object' : function( error, value) {
		assert.isObject(error);
	    },
	    'is refused' : function (error, value) {
    		assert.deepEqual(error.code, 'ECONNREFUSED');
    	    }
    	},
	'with a boolean result' : {
	    topic: function () {
		// process.on('uncaughtException', function(err) {
		//     console.log('Caught exception: ' + err.stack);
		// });
		// Basic http server that sends a chunked XML response
		var that = this;
		var server = net.createServer(function(s) {
		    s.on('data', function(data) {
			var data = '<?xml version="2.0" encoding="UTF-8"?>'
			    + '<methodResponse>'
			    + '<params>'
			    + '<param><value><boolean>1</boolean></value></param>'
			    + '</params>'
			    + '</methodResponse>';
			s.write(data, function() {
			    s.end();
			});
			s.end();
		    });
		});
		server.listen(9003, '127.0.0.1');
		var client = new Client('127.0.0.1', 9003)
		client.methodCall('listMethods', null, that.callback)
	    },
	    'does not contain an error' : function (error, value) {
		assert.isNull(error)
	    },
	    'contains the right value' : function (error, value) {
		assert.isTrue(value)
	    }
	},
	'with a string result' : {
	    topic: function () {
		// process.on('uncaughtException', function(err) {
		//     console.log('Caught exception: ' + err.stack);
		// });
		// Basic http server that sends a chunked XML response
		var that = this;
		var server = net.createServer(function(s) {
		    s.on('data', function(data) {
			var data = '<?xml version="2.0" encoding="UTF-8"?>'
			    + '<methodResponse>'
			    + '<params>'
			    + '<param><value><string>more.listMethods</string></value></param>'
			    + '</params>'
			    + '</methodResponse>';
			s.write(data, function() {
			    s.end();
			});
			s.end();
		    });
		});
		server.listen(9004, '127.0.0.1');
		var client = new Client('127.0.0.1', 9004)
		client.methodCall('listMethods', null, that.callback)
	    },
	    'does not contain an error' : function (error, value) {
		assert.isNull(error)
	    },
	    'contains the right value' : function (error, value) {
		assert.deepEqual(value, 'more.listMethods')
	    }
	},
	'with a int result' : {
	    topic: function () {
		// process.on('uncaughtException', function(err) {
		//     console.log('Caught exception: ' + err.stack);
		// });
		// Basic http server that sends a chunked XML response
		var that = this;
		var server = net.createServer(function(s) {
		    s.on('data', function(data) {
			var data = '<?xml version="2.0" encoding="UTF-8"?>'
			    + '<methodResponse>'
			    + '<params>'
			    + '<param><value><int>2</int></value></param>'
			    + '</params>'
			    + '</methodResponse>';
			s.write(data, function() {
			    s.end();
			});
			s.end();
		    });
		});
		server.listen(9005, '127.0.0.1');
		var client = new Client('127.0.0.1', 9005)
		client.methodCall('listMethods', null, that.callback)
	    },
	    'does not contain an error' : function (error, value) {
		assert.isNull(error)
	    },
	    'contains the right value' : function (error, value) {
		assert.deepEqual(value, 2)
	    }
	},
	'with a double result' : {
	    topic: function () {
		// process.on('uncaughtException', function(err) {
		//     console.log('Caught exception: ' + err.stack);
		// });
		// Basic http server that sends a chunked XML response
		var that = this;
		var server = net.createServer(function(s) {
		    s.on('data', function(data) {
			var data = '<?xml version="2.0" encoding="UTF-8"?>'
			    + '<methodResponse>'
			    + '<params>'
			    + '<param><value><double>3.56</double></value></param>'
			    + '</params>'
			    + '</methodResponse>';
			s.write(data, function() {
			    s.end();
			});
			s.end();
		    });
		});
		server.listen(9006, '127.0.0.1');
		var client = new Client('127.0.0.1', 9006)
		client.methodCall('listMethods', null, that.callback)
	    },
	    'does not contain an error' : function (error, value) {
		assert.isNull(error)
	    },
	    'contains the right value' : function (error, value) {
		assert.deepEqual(value, 3.56)
	    }
	},
	'with an array result' : {
	    topic: function () {
		// process.on('uncaughtException', function(err) {
		//     console.log('Caught exception: ' + err.stack);
		// });
		// Basic http server that sends a chunked XML response
		var that = this;
		var server = net.createServer(function(s) {
		    s.on('data', function(data) {
			var data = '<?xml version="2.0" encoding="UTF-8"?>'
			    + '<methodResponse>'
			    + '<params>'
			    + '<param><value><array><data>'
			    + '<value><string>test</string></value>'
			    + '<value><boolean>0</boolean></value>'
			    + '</data></array></value></param>'
			    + '</params>'
			    + '</methodResponse>';
			s.write(data, function() {
			    s.end();
			});
			s.end();
		    });
		});
		server.listen(9007, '127.0.0.1');
		var client = new Client('127.0.0.1', 9007)
		client.methodCall('listMethods', null, that.callback)
	    },
	    'does not contain an error' : function (error, value) {
		assert.isNull(error)
	    },
	    'contains the right number of elements' : function(error, value) {
		assert.deepEqual(value.length, 2);
	    },
	    'contains the right values' : function (error, value) {
		assert.deepEqual({string: value[0], bool: value[1]}, {string:'test', bool: false});
	    }
	},
	'with a struct result' : {
	    topic: function () {
		// process.on('uncaughtException', function(err) {
		//     console.log('Caught exception: ' + err.stack);
		// });
		// Basic http server that sends a chunked XML response
		var that = this;
		var server = net.createServer(function(s) {
		    s.on('data', function(data) {
			var data = '<?xml version="2.0" encoding="UTF-8"?>'
			    + '<methodResponse>'
			    + '<params>'
			    + '<param><value><struct>'
			    + '<member><name>firstName</name><value><string>test1</string></value></member>'
			    + '<member><name>secondName</name><value><boolean>0</boolean></value></member>'
			    + '</struct></value></param>'
			    + '</params>'
			    + '</methodResponse>';
			s.write(data, function() {
			    s.end();
			});
			s.end();
		    });
		});
		server.listen(9008, '127.0.0.1');
		var client = new Client('127.0.0.1', 9008)
		client.methodCall('listMethods', null, that.callback)
	    },
	    'does not contain an error' : function (error, value) {
		assert.isNull(error)
	    },
	    'contains the right values' : function (error, value) {
		assert.deepEqual(value, {firstName:'test1', secondName: false});
	    }
	}

    }
}).export(module);
