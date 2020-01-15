var port = process.env.PORT || 3001,
    socket = require('socket.io'),
    express = require('express'),
    fs = require('fs');


var app = express(),
    io = socket.listen(app.listen(port)),
    newFile = fs.createWriteStream(__dirname + '/data' + '/user_tasks.json');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    res.sendfile('index.html');
});

io.sockets.on('connect', function(client){
    console.log('connected !!!');
    client.on('userData', (data)  => {
        //console.log(data);
	newFile.write(data);
        client.emit('log', {hello:'file is saved!'});
        //client.broadcast.emit('hello', {hello : 'Hi from '+ data});
        //oldName = data;
        //io.sockets.emit('hello', {hello : 'Hi there to all '});
    });
    //client.on('new_message', (data)=>{
    //    client.emit('hello', {hello:'Привет '+ data});
    //    client.broadcast.emit('hello', {hello : oldName+ ' is now '+ data});
        //client.set('nickname', data);
    //});
    //client.on('disconnect', ()=>{
    //    io.sockets.emit('hello', {hello : oldName+ ' is leave us'});
    //});
});
