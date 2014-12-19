node-pew-transport
==================

Using the pew-transport you can send and receive binary files via an TCP socket connection.

pew-transport have 2 simples methods to prepare your files or messages and recovery it.

See below some examples of use:

###Prepare buffer

```javascript

var transport = require('pew-transport');

var buffer = new Buffer('My first test');
var buf = transport.prepare(buffer);

//buf is ready to send using TCP connections;

```

###Received buffer

```javascript

var transport = require('pew-transport');
var net = require('net');

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
    //your buffer is recovered!
    console.log(buff);
  });

});

server.listen(8080);

```
