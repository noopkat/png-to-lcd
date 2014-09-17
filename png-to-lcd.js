/**
 * png-to-lcd
 * exports framebuffer for use with common OLED displays
 */
var floydSteinberg = require('floyd-steinberg');
var pngparse = require('pngparse');

module.exports = png_to_lcd;

// pngparse doesn't quite have the correct object setup for pixel data
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

  // parse png file passed in
  pngparse.parseFile(filename, function(err, img) {
    if (err) {
      return callback(err);
    }
    // post process pixel data returned
    var pimage = createImageData(img);

    var pixels = pimage.data,
        pixelsLen = pixels.length
        height = pimage.height,
        width = pimage.width,
        alpha = pimage.hasAlphaChannel,
        threshold = 120,
        unpackedBuffer = [],
        depth = 4;

    // create a new buffer that will be filled with pixel bytes (8 bits per) and then returned
    var buffer = new Buffer((width * height) / 8);
    buffer.fill(0x00);

    // if dithering is preferred, run this on the pixel data first to transform RGB vals
    if (dither) {
      floydSteinberg(pimage);
    }

    // filter pixels to create monochrome image data
    for (var i = 0; i < pixelsLen; i += depth) {
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

      // create a new byte, set up page position
      var byte = 0,
          page = Math.floor(y / 8),
          pageShift = 0x01 << (y - 8 * page);

      // is the first page? Just assign byte pos to x value, otherwise add rows to it too
      (page === 0) ? byte = x : byte = x + width * page; 
      
      if (unpackedBuffer[i] === 0) {
        // 'off' pixel
        buffer[byte] &= ~pageShift;
        
      } else {
        // 'on' pixel
        buffer[byte] |= pageShift;
      }
    }
    
    callback(err, buffer);
  });
}