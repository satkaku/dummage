var fs = require("fs");
var mime = require("mime");
var glob = require("glob");

var RESOURCE_PATH = "./img"

module.exports = Dummage;

function Dummage(opts) {
	opts = opts || {};
	if (!(this instanceof Dummage)) return new Dummage(opts);
	this.root = opts.root || "dummage";
}

Dummage.prototype.any = function(cb) {
	glob("./img/*/*", function(err, files){
		var file = files[ Math.floor(Math.random()*files.length) ];
		_readFile(file, cb);
	});
}

Dummage.prototype.blank = function(cb) {
	_readFile(RESOURCE_PATH+"/blank/blank.png", cb);
}

Dummage.prototype.routes = function(path, cb) {
	glob("./img/"+path+"/*", function(err, files){
		var file = files[ Math.floor(Math.random()*files.length) ];
		_readFile(file, cb);
	});
}

Dummage.prototype.middleware = function() {
	var self = this;
	return function(req,res,next) {

		var tokens = req.path.slice(1).split("/");
		if ( tokens[0] !== self.root ) { return next(); }

		var command = tokens[1];
		if ( (typeof self[command]) !== "function" ) {
			self.routes(command, function(err, file){
				res.writeHead(200, { "Content-Type": file.mime });
				res.end(file.buf, "binary");
			});	
		} else {
			self[command](function(err, file){
				res.writeHead(200, { "Content-Type": file.mime });
				res.end(file.buf, "binary");
			});	
		}

	};
}


function _readFile(path, cb) {
	var _mime = mime.lookup(path);
	fs.readFile(path, function(err,data){
		cb(err, { buf: data, mime: _mime });
	});
}