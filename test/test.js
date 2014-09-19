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
