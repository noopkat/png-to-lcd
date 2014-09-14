/**
 * png-to-lcd
 * exports framebuffer for use with common OLED displays
 */
var floydSteinberg = require('../floyd-steinberg');
var pngjs = require('png-js');

module.exports = png_to_lcd;

function png_to_lcd(filename, dither, callback) {

  // create a new buffer that will be filled with pixel bytes and then returned
  var buffer = new Buffer((width * height) / 8);
  buffer.fill(0x00);

  // pngjs is a little special snowflake (special = annoying)
  var parrot = pngjs.load(filename);
  parrot.decode(function(image) {
    
    var pixels = image,
        height = parrot.height,
        width = parrot.width,
        alpha = parrot.hasAlphaChannel,
        threshold = 120,
        unpackedBuffer = [],
        depth = 4;

    // yes, really.
    parrot.data = image;

    // if dithering is preferred, run this on the pixel data first to transform RGB vals
    if (dither) {
      floydSteinberg(parrot);
    }

    // TODO: allow for different depths
    // if (!alpha) {
    //   depth = 3;
    // }

    for (var i = 0; i < pixels.length; i+=depth) {
      // just take the red value
      pixelVal = pixels[i + 1] = pixels[i + 2] = pixels[i];

        // do threshold for determining on and off pixel vals
        if (pixelVal > threshold) {
          pixelVal = 1;
        } else {
          pixelVal = 0;
        }
        
      // push to unpacked buffer list
      unpackedBuffer[i/depth] = pixelVal;

    }

    // time to pack the buffer
    for (var i = 0; i < unpackedBuffer.length; i++) {
      // math
      var x = Math.floor(i % width);
      var y = Math.floor(i / width);
      var byte = 0,
          page = Math.floor(y / 8),
          pageShift = 0x01 << (y - 8 * page);

      // is the first page?
      (page === 0) ? byte = x : byte = x + width * page; 
      
      if (unpackedBuffer[i] === 0) {
        // black or 'off' pixel
        buffer[byte] &= ~pageShift;
        
      } else {
        // white or 'on' pixel
        buffer[byte] |= pageShift;
      }
    }
    
    callback(null, buffer);
  });
}