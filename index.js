var fs = require("fs");
var mime = require("mime");
var glob = require("glob");
var gm = require("gm");

var RESOURCE_PATH = "./img";
var BLANK_PATH = RESOURCE_PATH+"/blank/blank.png";

module.exports = Dummage;

function Dummage(opts) {
	opts = opts || {};

	if (!(this instanceof Dummage)) return new Dummage(opts);
	this.root = opts.root || "dummage";
}

Dummage.prototype.any = function(size, cb) {
	_random("./img/*/*", function(err, file){
		_readFile(file, size, cb);
	});
}

Dummage.prototype.blank = function(size, cb) {
	_readFile(BLANK_PATH, size, cb);
}

Dummage.prototype.routes = function(size, path, cb) {
	_random("./img/"+path+"/*", function(err, file){
		_readFile(file, size, cb);
	});
}

Dummage.prototype.middleware = function() {
	var self = this;
	return function(req,res,next) {

		var tokens = req.path.slice(1).split("/");
		if ( tokens[0] !== self.root ) { return next(); }

		var command = tokens[1];
		
		var size = tokens[2];
		if ( size && /^[0-9]+x[0-9]+$/.test(size) ) {
			size = { _w: size.split("x")[0], _h: size.split("x")[1] };
		} else {
			size = null;
		}

		if ( (typeof self[command]) !== "function" ) {
			self.routes(command, size, _response);
		} else {
			self[command](size, _response);	
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

function _random(path, cb) {
	glob(path, function(err, files){
		var file = files[ Math.floor(Math.random()*files.length) ];
		cb(err, file);
	});
}

function _readFile(path, size, cb) {
	if (!path) { path = BLANK_PATH; }
	var _mime = mime.lookup(path);

	var buf = require('fs').readFileSync(path);
	var convert = gm(buf, path.split("/").slice(-1) )
	
	if (size) {
		convert.gravity("Center").crop(size._w, size._h);
	}

	convert.toBuffer(function (err, buffer) {
		cb(err, { buf: buffer, mime: _mime });
	});
}