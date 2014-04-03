var http = require("http");
var url = require("url");
var io = require("socket.io");
var counts = 0;

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
		//send data to client
		/*
		setInterval(function(){
        socket.emit('date', {'date': new Date()});
		}, 100);
		*/
		socket.on('client_data', function (data){
			counts++;
			console.log('increase count: '+counts);
			socket.emit('count', {'count':counts});
			//process.stdout.write(data.letter);
		});
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