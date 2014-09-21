png-to-lcd
==========

Convert a PNG image into an LCD/OLED compatible framebuffer

## Install
```javascript
npm install png-to-lcd
```

## What does it do?
png-to-lcd consumes a PNG image file, and returns the image data, formatted for LCD and OLED screens (an 8-bit/byte framebuffer). It's just monochrome support for now. It's especially been written to support SSD1306 OLED displays. You can buy these pretty cheaply on [Adafruit](http://www.adafruit.com/products/938) (my favourite), Sparkfun, eBay, and sites like Banggood. 

## What doesn't it do?
Image prep - the image you pass in should be an RGBA PNG (both colour and greytone are acceptable), and sized to the exact dimensions of the screen you'd like to use. So if your screen is 128x64 pixels, size it so in your image editor of choice. 

I suggest [Pixelmator](http://www.pixelmator.com), [Acorn](http://www.flyingmeat.com/acorn), or [GIMP](http://www.gimp.org) if you're into desktop software. Alternatively, if you're into super awesome software made in the browser by a badass, try [Jenn Schiffer's](http://twitter.com/jennschiffer) noice [make8bitart.com](http://make8bitart.com), which is really quite suitable for this kind of low res screen design.

## Usage
png-to-lcd takes three arguments:

_string_ **filename**  - this is pretty obvious really.

_bool_ **dither** - do you want to run a dithering algorithm on your image?

_function_ **callback** - callback when image formatting complete


## Example
```javascript
var pngtolcd = require('png-to-lcd');

pngtolcd('cat.png', true, function(err, buffer) {
	console.log(buffer.toString('hex'));
});

```

## What the heck is dithering?
Dithering is a method of diffusing pixels in order to avoid harsh edges or banding where the colours in an image contrast with each other. Fancy algorithms and stuff. 

png-to-lcd uses the [Floyd Steinberg](https://github.com/noopkat/floyd-steinberg) algorithm specifically, as it produces the clearest images on a pixel screen in my experience.

## When should I opt to use dithering?
If you're trying to convert a photo, or detailed image - use dithering! You'll retain more detail.

## When should I _not_ ask for dithering?
If you have crisp line detailing in your image, it's best not to dither as it makes a real mess of things. This includes things like text, and simple pixel art drawings. When you pass in false for the dither argument, png-to-lcd will just apply a simple threshold filter to produce your dark/light filters in the buffer.

## Show me some output
Ok. You can make stuff like this.

Dithered 128 x 32 display example:  
![cat 128x32](https://raw.githubusercontent.com/noopkat/png-to-lcd/master/test/examples/mono-128x32.png)

Dithered 128 x 64 display example:  
![cat 128x32](https://raw.githubusercontent.com/noopkat/png-to-lcd/master/test/examples/mono-128x64.png)

Non dithered 128 x 32 display text example:  
![noopkat](https://raw.githubusercontent.com/noopkat/png-to-lcd/master/test/examples/noopkat-mono.png)

## My images don't look perfect  (╯°□°）╯︵ ┻━┻
That's understandable. A computer program will do its best to guess at the best optimizations, but it has little context for what the heck it's working on for you. You may find that some screen designs needs a little tweaking before it's perfect. 

For non dithered pics - try nudging the pixels using just black and white only (no grey) in your image editor for best results before running it through this module.

