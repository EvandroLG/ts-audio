var http = require('http');
var fs = require('fs');
var url = require('url');
var mimeTypes = {
   'html': 'text/html',
   'css': 'text/css',
   'js': 'text/js'
};

var onHead = function(response, content, statusCode, extension){
   var mimeType = mimeTypes[extension];

   response.writeHead(statusCode, { 'Content-Type': mimeType });
   response.end(content, 'utf-8');
};

http.createServer(function(request, response){
   var pathname = '.' + url.parse(request.url, true).pathname;

   fs.readFile(pathname, function(error, content){
      if(error){
         onHead(response, content, 400, 'html');
      }
      
      var extension = pathname.split('.')[2];
      onHead(response, content, 200, extension);
   });
}).listen(9000);