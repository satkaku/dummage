var assert = require('power-assert');
var Dummage  = require("../index.js");

describe("parse", function(){
	
	it("can parse any command", function(){
		var target = new Dummage();
		var path = "dummage/any";
		var result = target.parse(path.split("/"));
		assert.equal(result.command, "any");
	});

	it("can parse blank command", function(){
		var target = new Dummage();
		var path = "dummage/blank";
		var result = target.parse(path.split("/"));
		assert.equal(result.command, "blank");
	});

	it("can parse routes command", function(){
		var target = new Dummage();
		var path = "dummage/animal";
		var result = target.parse(path.split("/"));
		assert.equal(result.command, "routes");

		var path2 = "dummage/person";
		var result2 = target.parse(path.split("/"));
		assert.equal(result2.command, "routes");
	});

	it("can parse size", function(){
		var target = new Dummage();
		var path = "dummage/any/300x200";
		var result = target.parse(path.split("/"));
		assert.equal(result.size._w, "300");
		assert.equal(result.size._h, "200");
	});

	it("if size format is invalid", function(){
		var target = new Dummage();
		var path = "dummage/any/300200";
		var result = target.parse(path.split("/"));
		assert.equal(result.size, null);

		var path2 = "dummage/any/300x";
		var result2 = target.parse(path.split("/"));
		assert.equal(result2.size, null);

		var path3 = "dummage/any/x200";
		var result3 = target.parse(path.split("/"));
		assert.equal(result3.size, null);
	});

	it("can parse color", function(){
		var target = new Dummage();
		var path = "dummage/any:0xff9933/300x200";
		var result = target.parse(path.split("/"));
		assert.equal(result.color.r, 255);
		assert.equal(result.color.g, 153);
		assert.equal(result.color.b, 51);
	});

});