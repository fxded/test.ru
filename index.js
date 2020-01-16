var port = process.env.PORT || 3001,
    socket = require('socket.io'),
    express = require('express'),
    fs = require('fs');


var app = express(),
    io = socket.listen(app.listen(port));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
    res.sendfile('index.html');
});

io.sockets.on('connect', function(client){
    //var fName = __dirname + '/data';
    console.log('connected !!!');
    client.on('userData', (data)  => {
        var userData = JSON.parse(data);
	if (userData.draftFlag) {
		var newFile = fs.createWriteStream(__dirname + '/data' + '/draft_data.user');
	} else {
		var newFile = fs.createWriteStream(__dirname + '/data' + '/data.user');
	}
	newFile.write(data);
        client.emit('log', {hello:'file is saved! draft copy is ' 
			    + JSON.parse(data).draftFlag});
    });
    client.on('getUserData', (flag) => {
	if (flag) {
		var fName = __dirname + '/data' + '/draft_data.user';
	} else {
                var fName = __dirname + '/data' + '/data.user';
	}
        var uData = '',
	    fromFile = fs.createReadStream(fName);
	fromFile.on('data', (chunk) => {
	    uData += chunk;
	});
	fromFile.on('end', () => {
	    //console.log(uData);
	    client.emit('pushUserData', uData);
	    fs.unlink(fName, (err) => {
		if (err) console.log(err + 'удаление после чтения');
	    });
	});
    });
	client.on('getFileStatus', (flag) => {
		if (flag) {
			var fName = __dirname + '/data' + '/draft_data.user';
		} else {
			var fName = __dirname + '/data' + '/data.user';
		}
		fs.access(fName, fs.constants.F_OK, (err) => {
                	client.emit('pushFileStatus', err);
		 });
	});
});

