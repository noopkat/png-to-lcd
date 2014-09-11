var png = require('png-js');
var width = 128;
var height = 32;
var buffer = new Buffer(512);
buffer.fill(0x00);

png.decode('./noopkat3.png', function(pixels) {
  console.log(pixels.length);
    for (var i = 0; i < pixels.length; i++) {

      var x = (i % width) / 4;
      var y = Math.floor(i / width);
      //console.log(x, y);
    }
});