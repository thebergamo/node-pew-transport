var assert = require('assert');
var transport = require(__dirname+'/../lib/transport');
var net = require('net');
before(function(){
  var server = net.createServer(function(socket) {
    socket.on('error', function(){
      console.log('server connected');
    });
    socket.on('end', function() {
      console.log('server disconnected');
    });
    socket.on('error', function(err){
      console.log('error: '+err);
    });

    transport.recovery(socket, transport.DEFAULT_ENDIAN, function(buff){
      socket.write(buff);
    });

  });

  server.listen(8080);
});

describe('Recovery buffer to transport', function(){
  it('recovery buffer encoded using BE', function(done){
    var buffer = new Buffer('Its my first test');
    var buf = transport.prepare(buffer, transport.BIG_ENDIAN);
    var client = net.connect({port: 8080}, function() {
      client.write(buf);
    });
    client.on('data', function(data) {
      assert.equal(buffer.toString(), data.toString());
      done();
    });
    client.on('end', function() {
      console.log('client disconnected');
    });
  });
  it('recovery buffer encoded using LE', function(done){
    var buffer = new Buffer('Its my first test');
    var buf = transport.prepare(buffer, transport.LITTLE_ENDIAN);
    var client = net.connect({port: 8080}, function() {
      client.write(buf);
    });
    client.on('data', function(data) {
      assert.equal(buffer.toString(), data.toString());
      done();
    });
    client.on('end', function() {
      console.log('client disconnected');
    });
  })
  it('recovery buffer not send the encoded using default', function(done){
    var buffer = new Buffer('Its my first test');
    var buf = transport.prepare(buffer, transport.BIG_ENDIAN);
    var client = net.connect({port: 8080}, function() {
      client.write(buf);
    });
    client.on('data', function(data) {
      assert.equal(buffer.toString(), data.toString());
      done();
    });
    client.on('end', function() {
      console.log('client disconnected');
    });
  })
});
