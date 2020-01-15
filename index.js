var socket = require('socket.io');
var express = require('express');
var app = express();
var io = socket.listen(app.listen(3001));
var oldName;
app.get('/', function(req,res){
//    res.send('hello socket');
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connect', function(client){
    //console.log('connected !!!');
    client.on('message', (data)=>{
        //client.set('nickname', data);
        //console.log(data);
        client.emit('hello', {hello:'Привет '+ data});
        client.broadcast.emit('hello', {hello : 'Hi from '+ data});
        oldName = data;
        //io.sockets.emit('hello', {hello : 'Hi there to all '});
    });    
    client.on('new_message', (data)=>{
        client.emit('hello', {hello:'Привет '+ data});
        client.broadcast.emit('hello', {hello : oldName+ ' is now '+ data});
        //client.set('nickname', data);
    });
    client.on('disconnect', ()=>{
        io.sockets.emit('hello', {hello : oldName+ ' is leave us'});
    });
});
