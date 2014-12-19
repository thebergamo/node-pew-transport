var assert = require('assert');
var transport = require(__dirname+'/../lib/transport');
describe('Prepare buffer to transport', function(){
  it('buffer is encoded using BE', function(){
    var buffer = new Buffer('Its my first test');
    var buf = transport.prepare(buffer, transport.BIG_ENDIAN);

    assert.notEqual(buf, buffer);
  });
  it('buffer is encoded using LE', function(){
    var buffer = new Buffer('Its my first test');
    var buf = transport.prepare(buffer, transport.LITTLE_ENDIAN);
    
    assert.notEqual(buf, buffer);
  })
  it('buffer not send the encoded using default', function(){
    var buffer = new Buffer('Its my first test');
    var buf = transport.prepare(buffer);

    assert.notEqual(buf, buffer);
  })
});
