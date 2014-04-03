var http = require("http");
var url = require("url");


/*
http.createServer(function (request, response) {
	console.log('Req received! ');
	response.writeHead(200, {"Content-Type:": "text/plain"});
	response.write("Hello world!!!!!");
	response.end();
}).listen(8888);
*/

/*
function onRequest(request, response) {
	console.log("Request received.");
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello World");
	response.end();
}
*/

function start(route, handle) {
	function onRequest(request, response) {
		var postData = "";
		var pathname = url.parse(request.url).pathname;
		console.log("Request received for " + pathname + " received.");
				
		route(handle, pathname, response, request);
	}
	http.createServer(onRequest).listen(5000);
	console.log("Server has started.");
}
exports.start = start;