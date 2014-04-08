var http = require("http");
var url = require("url");
var io = require("socket.io");
var counts = 0;
var clients = []
var clientSockets = [];

/*
http.createServer(function (request, response) {
	console.log('Req received! ');
	response.writeHead(200, {"Content-Type:": "text/plain"});
	response.write("Hello world!!!!!");
	response.end();
}).listen(8888);
*/

function start(route, handle) {
	function onRequest(request, response) {
		var postData = "";
		var pathname = url.parse(request.url).pathname;
		console.log("Request received for " + pathname + " received.");
				
		route(handle, pathname, response, request, counts);
	}
	
	var server = http.createServer(onRequest).listen(process.env.PORT || 5000);
		
	io.listen(server).on('connection', function(socket){
		console.log('Client connected...');
		clientSockets.push(socket);
		counts++;
		emitToAll(counts);
		var new_player = {
			id: Math.floor((Math.random()*1000)+1),
			x:4361,
			y:40,
			z:960,
			position:{},
			quaternion:
			{
				x:0,
				y:0,
				z:0,
				w:0,
			},
			angle:0,
			//socket:socket;
			}
		clients.push(new_player);
		socket.emit('connected', {'uniqueID':new_player.id});
		
		//send data to client
		
		setInterval(function(){
			socket.broadcast.emit('allPlayerPositions', clients);
		}, 500);
		
		socket.on('disconnect', function () {
			console.log('Client disconnected!');
			counts--;
			socket.broadcast.emit('count', {'count':counts});
			socket.broadcast.emit('remove', {'removeID':new_player.id});
			var dc = clientSockets.indexOf(socket);
			var re = clients.indexOf(new_player);
			clients.splice(re,1);
			delete clientSockets[dc];
		});
		
		socket.on('position', function (data){
			var pl = clients.indexOf(new_player);
		
			new_player.x = data.x;
			new_player.y = data.y;
			new_player.z = data.z;
			new_player.position = data.position;
			new_player.quaternion = data.quaternion;
			new_player.id = data.id;
			console.log('data received: '+data.x);
			
			var pl = clients.indexOf(new_player);
			console.log('changing lient coord: '+pl);
			clients[pl].x = data.x;
			clients[pl].y = data.y;
			clients[pl].position = data.position;
			clients[pl].quaternion = data.quaternion;
			clients[pl].z = data.z;
			//process.stdout.write(data.letter);
		});
		
		function emitPositionToAll(counts){
			//io.sockets.emit('count', {'count':counts});
			socket.emit('count', {'count':counts});
			socket.broadcast.emit('count', {'count':counts});
			//socket.emit('count', {'count':counts});
		}
		
		function emitToAll(counts){
			//io.sockets.emit('count', {'count':counts});
			socket.emit('count', {'count':counts});
			socket.broadcast.emit('count', {'count':counts});
			//socket.emit('count', {'count':counts});
		}
	});
	//io.set('log level', 1);
	//var io = io.listen(http.createServer(onRequest).listen(process.env.PORT || 5000););
	//io.listen(server);
	/*
	io.sockets.on('connection', function(socket){
		socket.emit('message', {'message': 'hello world'});
	});
	
	
	
	io.sockets.on('connection', function(socket){
		//send data to client
		setInterval(function(){
        socket.emit('date', {'date': new Date()});
		}, 1000);
	});
	*/
	console.log("Server has started.");
}
exports.start = start;