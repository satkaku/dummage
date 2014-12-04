var dummage = require("./index.js")();

var app = require("express")();
app.get("/", function(req,res){
	res.send("hello");
});
app.use( dummage.middleware() );
app.listen(3000, function(){
	console.log("listen 3000")
});