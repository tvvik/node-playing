var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

function start(response) {
	console.log("Request handler 'start' was called.");
		
	var body = '<html>'+
				'<head>'+
				'<meta http-equiv="Content-Type" '+
				'content="text/html; charset=UTF-8" />'+
				'</head>'+
				'<body>'+
					'<form action="/upload" enctype="multipart/form-data" '+
					'method="post">'+
						'<input type="file" name="upload">'+
						'<input type="submit" value="Upload file" />'+
					'</form>'+
				'</body>'+
				'</html>';
		
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
	/*
	function sleep(milliSeconds) {
		var startTime = new Date().getTime();
		while (new Date().getTime() < startTime + milliSeconds);
	}
	sleep(10000);
	return "Hello Start";
	*/
}
function upload(response, request) {
	console.log("Request handler 'upload' was called.");
	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		/* Possible error on Windows systems:
		tried to rename to an already existing file */
		response.writeHead(200, {"Content-Type": "text/html"});
		fs.rename(files.upload.path, __dirname + "/tmp/tmp.png", function(err) {
			if (err) {
				fs.unlink(__dirname + "/tmp/tmp.png");
				fs.rename(files.upload.path, __dirname + "/tmp/tmp.png", function (err) {
					if (err) console.log('error renaming file');
				});
			}
		});		
		response.write("received image:<br/>");
		response.write("<img src='/show' />");
		response.end();
	});
}

function show(response) {
	console.log("Request handler 'show' was called.");
	fs.readFile(__dirname+"/tmp/tmp.png", "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + " aruncata de FS \n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}


exports.start = start;
exports.upload = upload;
exports.show = show;