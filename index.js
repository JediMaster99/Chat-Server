var express = require('express');
var app = express();
var serv = require('http').Server(app);
var ChatData = [
]
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//ChatData.push("<li>This is a test2</li>");
//console.log(ChatData);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(4000);
console.log("Server Started");

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
  console.log("socket connecton");
  io.sockets.emit('ChangeText', {
    textChange: "A new user has connected to the server!!",
    ChatText: ChatData
  });
  socket.emit('Load', {
    ChatText: ChatData
  });

  socket.on('ServerMSG', function(data) {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    console.log(time + ' - ' + data.name + ': ' + data.content);
    ChatData.push("<li>" + time + ' - ' + data.name + ': ' + data.content + "</li>");
    io.sockets.emit('ChangeText', {
      textChange: time + ' - ' + data.name + ': ' + data.content
    });
  })

  var intervalId = setInterval(function() {
    if (ChatData.length >= 20) {
      ChatData = [];
      console.log('cleared array');
      console.log(ChatData);
      ChatData.push("The chat has been cleared to save memory!");
    }
  }, 5000);
});

