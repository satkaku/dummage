var fs = require("fs");
var mime = require("mime");
var glob = require("glob");

var RESOURCE_PATH = "./img";
var BLANK_PATH = RESOURCE_PATH+"/blank/blank.png";

module.exports = Dummage;

function Dummage(opts) {
	opts = opts || {};

	if (!(this instanceof Dummage)) return new Dummage(opts);
	this.root = opts.root || "dummage";
}

Dummage.prototype.any = function(cb) {
	_random("./img/*/*", function(err, file){
		_readFile(file, cb);
	});
}

Dummage.prototype.blank = function(cb) {
	_readFile(BLANK_PATH, cb);
}

Dummage.prototype.routes = function(path, cb) {
	_random("./img/"+path+"/*", function(err, file){
		_readFile(file, cb);
	});
}

function _random(path, cb) {
	glob(path, function(err, files){
		var file = files[ Math.floor(Math.random()*files.length) ];
		cb(err, file);
	});
}

Dummage.prototype.middleware = function() {
	var self = this;
	return function(req,res,next) {

		var tokens = req.path.slice(1).split("/");
		if ( tokens[0] !== self.root ) { return next(); }

		var command = tokens[1];
		if ( (typeof self[command]) !== "function" ) {
			self.routes(command, _response);
		} else {
			self[command](_response);	
		}

		function _response(err, data) {
			if (err) {
				res.writeHead(500);
				res.end();
				return;
			}
			res.writeHead(200, { "Content-Type": data.mime });
			res.end(data.buf, "binary");
		}

	};
}


function _readFile(path, cb) {
	if (!path) { path = BLANK_PATH; }
	var _mime = mime.lookup(path);
	fs.readFile(path, function(err,data){
		cb(err, { buf: data, mime: _mime });
	});
}