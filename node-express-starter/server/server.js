var http        = require('http');
var url         = require('url');
var querystring = require('querystring');
var fs          = require('fs');
var path        = require('path');

var ext = /[\w\d_-]+\.[\w\d]+$/;
http.createServer(function(request, response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    

    pathName = url.parse(request.url).pathname;
    query    = url.parse(request.url).query;
    if (request.url === '/') {
        response.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('main.html').pipe(response);
    }
    else if (ext.test(request.url))
    {
        fs.exists(path.join(__dirname, request.url), function (exists) {
            if (exists) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                fs.createReadStream('main.html').pipe(response);
            } else {
                response.writeHead(404, {'Content-Type': 'text/html'});
                fs.createReadStream('404.html').pipe(response);
            }
        });
    }
    // fs.readFile('main.html', function(err, data){
    //     if(err){
    //         response.writeHead(404, {'Content-Type':'text/plain'});
    //         response.write('Page Was Not Found');
    //         response.end();
    //     }
    //     else
    //     {
    //         response.writeHead(200, {'Content-Type':'text/html'});
    //         response.write(data);
    //         response.end();
    //     }
    // })
}).listen(8080);