var fs = require("fs");
var mime = require("mime");
var glob = require("glob");
var gm = require("gm");

var RESOURCE_PATH = __dirname + "/img";
var BLANK_PATH = RESOURCE_PATH+"/blank/blank.png";

module.exports = Dummage;

function Dummage(opts) {
	opts = opts || {};

	if (!(this instanceof Dummage)) return new Dummage(opts);
	this.root = opts.root || "dummage";
}

Dummage.prototype.any = function(cb, size, color) {
	_random(RESOURCE_PATH+"/*/*", function(err, file){
		_readFile(file, cb, size, color);
	});
};

Dummage.prototype.blank = function(cb, size) {
	_readFile(BLANK_PATH, cb, size);
};

Dummage.prototype.routes = function(command, cb, size, color) {
	_random(RESOURCE_PATH+"/"+command+"/*", function(err, file){
		_readFile(file, cb, size, color);
	});
};

Dummage.prototype.middleware = function() {
	var self = this;
	return function(req,res,next) {

		var tokens = req.path.slice(1).split("/");
		if ( tokens[0] !== self.root ) { return next(); }

		var command = tokens[1];
		var color = command.split(":")[1];
		command = command.split(":")[0];

		var size = tokens[2];
		if ( size && /^[0-9]+x[0-9]+$/.test(size) ) {
			size = { _w: size.split("x")[0], _h: size.split("x")[1] };
		} else {
			size = null;
		}

		if ( (typeof self[command]) !== "function" ) {
			self.routes(command, _response, size, color);
		} else {
			self[command](_response, size, color);
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
};

function _random(path, cb) {
	glob(path, function(err, files){
		var file = files[ Math.floor(Math.random()*files.length) ];
		cb(err, file);
	});
}

function _readFile(path, cb, size, color) {
	if (!path) { path = BLANK_PATH; }
	var _mime = mime.lookup(path);

	var buf = require('fs').readFileSync(path);
	var convert = gm(buf, path.split("/").slice(-1) );
	
	if (size) {
		convert.gravity("Center").crop(size._w, size._h);
	}

	if (color) {
		var r = color >> 16 & 0xFF;
		var g = color >> 8 & 0xFF;
		var b = color & 0xFF;
		convert.colorize(r,g,b);
	}

	convert.toBuffer(function (err, buffer) {
		cb(err, { buf: buffer, mime: _mime });
	});
}