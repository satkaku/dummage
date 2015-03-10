#!/usr/bin/env node
var program = require('commander');
var express = require('express');
var app = express();
var dummage = require("./index.js")();

program.version('0.2.0')
		.option('-p, --port', 'change port')
		.parse(process.argv);

var port = program.args[0] || 3000;

app.use( dummage.middleware() );
app.listen(port, function(){
	console.log("listen "+port);
});