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

Dummage.prototype.any = function(cb, opts) {
	_random(RESOURCE_PATH+"/*/*", function(err, file){
		_readFile(file, cb, opts);
	});
};

Dummage.prototype.blank = function(cb, opts) {
	_readFile(BLANK_PATH, cb, opts);
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

		var opts = self.parse(tokens);

		self[opts.command](_response, opts);

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
Dummage.prototype.parse = function(tokens) {
	var command,size,color;

	
	var firstToken = tokens[1].split(":");
	if ( firstToken.length > 1 ) {
		var _colorHex = firstToken[1];
		color = {
			r : _colorHex >> 16 & 0xFF,
			g : _colorHex >> 8 & 0xFF,
			b : _colorHex & 0xFF
		};
	}
	command = firstToken[0];

	if ( (typeof this[command]) !== "function" ) {
		command = "routes";
	}

	var secondToken = tokens[2];
	if ( secondToken && /^[0-9]+x[0-9]+$/.test(secondToken) ) {
		size = { _w: secondToken.split("x")[0], _h: secondToken.split("x")[1] };
	}

	return {
		command: command, size: size, color: color
	};
};


function _random(path, cb) {
	glob(path, function(err, files){
		var file = files[ Math.floor(Math.random()*files.length) ];
		cb(err, file);
	});
}

function _readFile(path, cb, opts) {
	if (!path) { path = BLANK_PATH; }
	var _mime = mime.lookup(path);

	var buf = require('fs').readFileSync(path);
	var convert = gm(buf, path.split("/").slice(-1) );
	
	if (opts.size) {
		convert.gravity("Center").crop(opts.size._w, opts.size._h);
	}

	if (opts.color) {
		convert.colorize(opts.color.r,opts.color.g,opts.color.b);
	}

	convert.toBuffer(function (err, buffer) {
		cb(err, { buf: buffer, mime: _mime });
	});
}