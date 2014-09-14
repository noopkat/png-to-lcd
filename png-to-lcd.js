/**
 * png-to-lcd
 * exports framebuffer for use with common OLED displays
 */
var floydSteinberg = require('../floyd-steinberg');
var pngparse = require('pngparse');

module.exports = png_to_lcd;

function createImageData(image) {
  var buf = new Buffer(image.width * image.height * 4);

  var l = image.data.length;
  var pos = 0;
  for (var y = 0; y < image.height; y++) {
    for (var x = 0; x < image.width; x++) {
      buf.writeUInt32BE(image.getPixel(x, y), pos);
      pos += 4;
    }
  }

  image.data = buf;

  return image;
}

function png_to_lcd(filename, dither, callback) {

  pngparse.parseFile(filename, function(err, img) {
    if (err) {
      return callback(err);
    }

    var parrot = createImageData(img);

    var pixels = parrot.data,
        height = parrot.height,
        width = parrot.width,
        alpha = parrot.hasAlphaChannel,
        threshold = 120,
        unpackedBuffer = [],
        depth = 4;

    // create a new buffer that will be filled with pixel bytes and then returned
    var buffer = new Buffer((width * height) / 8);
    buffer.fill(0x00);

    

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