/**
 * png-to-lcd
 * exports framebuffer for use with common OLED displays
 */
var pngparse = require('pngparse');
var floydSteinberg = require('../floyd-steinberg');

module.exports = png_to_lcd;

function png_to_lcd(filename, dither, callback) {
  pngparse.parseFile(filename, function(err, image) {
    if (err) {
      return cb(err);
    }

    var depth = image.channels,
        pixels = image.data,
        pixelCount = pixels.length,
        height = image.height,
        width = image.width,
        threshold = 0.75,
        unpackedBuffer = [];

    var buffer = new Buffer(width * height);
    buffer.fill(0x00);

    // if dithering is preferred, run this on the pixel data first to transform RGB vals
    if (dither) {
      pixels = floydSteinberg(image).data;
    }

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var index = (width * y + x) << 2;
        var value = parseInt(image.getPixel(x, y), 16);

        var r = value.substr(0,1),
            g = value.substr(2,3),
            b = value.substr(4,5);

        // if dithering is NOT preferred
        if (!dither) {
          // luminosity adjustments
          var lumR = 0.299,
              lumG = 0.587,
              lumB = 0.114;
          
          // average out to a grey
          value = Math.floor(((r * lumR) + (g * lumG) + (b * lumB)) / 3);
        } else {
          // dithered result has same value for every color channel (0 or 255), so r is fine
          value = r;
        }

        // weed out RGB depth to make just black or white pixel
        if (value > threshold * value) {
          value = 1;
        } else {
          value = 0;
        }
        unpackedBuffer[index] = value;
      }
    } 

    // time to pack the buffer
    for (var i = 0; i < unpackedBuffer.length; i++) {
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