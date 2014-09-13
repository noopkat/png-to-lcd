var pngparse = require('pngparse');
var buffer = new Buffer(4096);
buffer.fill(0x00);

module.exports = png_to_lcd;

function png_to_lcd(filename, dither, callback) {
  pngparse.parseFile(filename, function(err, image) {
    if (err) {
      return cb(err);
    }

    var depth = image.channels,
        pixels = image.data,
        pixelCount = pixels.length;

    // TODO: conditional here calculating bit dpeth

    for (var i = 0; i < pixelCount; i += 1) {
      console.log(pixels[i])
      // if any of the pixels returns 0, it's 'false' and will set the pixel to 0, otherwise set it to 1
      // TODO: replace this with a smart threshold pixel color decider 
      //buffer[i/4] = (pixels[i] || pixels[i+1] || pixels[i+2]) ? 1 : 0;

      // TODO: put in floyd-steinberg, based on dither bool conditional from module params
      //if (dither) {
        //etc etc...
      //}
    }
    callback(null, buffer);
  });
}