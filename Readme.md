# dummage

dummage is a dummy image generator

## Getting started

This module depends on [gm](https://www.npmjs.org/package/gm), so first,
you should download and install [GraphicsMagick](http://www.graphicsmagick.org/).

In Mac OS X

```
brew install graphicsmagick
```

then

```
npm install dummage
```

And, add some image to "./img/#{theme}",
you can get "/dummage/#{theme}".

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

+ `http://localhost:3000/dummage/person/300x200`: random person image(crop 300px x 200px)

## without Express

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

## Option
- `root`: dummy image path root (dafault: "dummage")

## Photo
+ https://unsplash.com/
+ http://www.pexels.com/
+ http://www.gratisography.com/

Thanks to these website.

To reduce module size
```bash
find . -name "*jpg" -exec convert {} -resize 640x640 {} \;  
```

## crop
+ `http://localhost:3000/dummage/any/400x200`: crop image (gravity is "Center")

## Why I make this ?
Yes, there are many dummy image service, but I think those are too slowly to give a presentation of prototype. I need more quicky dummy image generator.