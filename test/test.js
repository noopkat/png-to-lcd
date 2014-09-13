var test = require('tape');
var pngtolcd = require('../png-to-lcd');

test('should convert image to monochrome buffer', function(t) {
  pngtolcd(__dirname + '/icecream.png', false, function(err, buffer) {
    t.ok(!err);
    console.log(buffer.toString('hex'));
    t.equal(buffer[0], 1);
    t.equal(buffer[68], 0);
    t.end();
  });
});