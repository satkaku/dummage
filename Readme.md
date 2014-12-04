# dummage

dummage is a dummy image generator

## Example

```javascript
var dummage = require("dummage")();

dummage.any(function(err,data){
	// random image
});
dummage.blank(function(err, data){
	// blank image
});

dummage.routes("person", function(err, data){
	// random person image
});

```

## use Express
```javascript
var dummage = require("dummage")();
var app = require("express")();
app.use( dummage.middleware() );
app.listen(3000, function(){
	console.log("listen 3000")
});
```

+ `http://localhost:3000/dummage/any`: random image

+ `http://localhost:3000/dummage/blank`: blank image

+ `http://localhost:3000/dummage/person`: random person image

## Option
- `root`: dummy image path root (dafault: "dummage")

## Install
```
npm install dummage
```

And, add some image to "./img/#{theme}",
you can get "/dummage/#{theme}".

I will add default photos(free use) that I take.

## size change
```css
img { width: 100px; height: 100px; }
```

## Why I make this ?
Yes, there are many dummy image service, but I think those are too slowly to give a presentation of prototype. I need more quicky dummy image generator.