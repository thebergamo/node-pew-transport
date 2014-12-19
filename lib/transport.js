/*
  This lib will receive a buffer and configure the buffer to send a little header
  with the length of the bytes of the buffer.
*/

var transport = {};

// CONST

transport.BIG_ENDIAN = 0;

transport.LITTLE_ENDIAN = 1;

transport.DEFAULT_ENDIAN = transport.LITTLE_ENDIAN;

transport.prepare = function(buff, endian){
  endian = endian || transport.DEFAULT_ENDIAN;
  var buffer = new Buffer(4+buff.length);
  if(endian === transport.BIG_ENDIAN)
    buffer.writeInt32BE(buff.length, 0);
  else
    buffer.writeInt32LE(buff.length, 0);

  buff.copy(buffer, 4, 0);
  return buffer;
};

transport.recovery = function(socket, endian, cb){
  var stream = require('through2');
  var firstChunk = true;
  var sum = -1;
  var buffer = new Buffer(0);
  endian = endian || transport.DEFAULT_ENDIAN;
  buf = socket.pipe(stream.obj(function(chunk, enc, callback){
    if(firstChunk){
      firstChunk = false;
      sum = 0;
      if(endian === transport.BIG_ENDIAN)
        totalMessage = chunk.readInt32BE(0);
      else
        totalMessage = chunk.readInt32LE(0);

      buffer = new Buffer(4+totalMessage);
    }

    chunk.copy(buffer, sum);

    sum += chunk.length;

    if(sum >= totalMessage){
      firstChunk = true;
      sum = 0;
      totalMessage = 0;
      this.push(buffer);
      buffer = new Buffer(0);
    }

    callback();
  }));

  buf.on('data', function(buff){
    cb(buff.slice(4));
  });

}


module.exports = transport;
