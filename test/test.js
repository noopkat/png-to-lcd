var test = require('tape');
var pngtolcd = require('../png-to-lcd');

test('should convert image to a buffer', function(t) {
  pngtolcd(__dirname + '/cat.png', true, function(err, buffer) {
    t.ok(!err);
    //console.log(buffer.toString('hex'));
    t.equal(Buffer.isBuffer(buffer), true);
    t.end();
  });
});

// commenting this out, as it's only because of the current monochome only support
/*
test('buffer should return monochrome pixel data', function(t) {
  pngtolcd(__dirname + '/cat.png', true, function(err, buffer) {
    t.ok(!err);
    t.equal(buffer[0].toString('hex'), 0x00 | 0xFF);
    t.end();
  });
});
*/
