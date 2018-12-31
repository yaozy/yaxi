const fs = require('fs');
const path = require('path');
const http = require('http');
const base = process.cwd();


const mime = {
    htm: 'text/html',
    html: 'text/html',
    shtml: 'text/html',
    txt: 'text/plain',
    xml: 'text/xml',
    css: 'text/css',
    json: 'application/json',
    js: 'application/javascript',
    htc: 'text/x-component',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    woff: 'application/font-woff',
    eot: 'application/vnd.ms-fontobject',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    svgz: 'image/svg+xml',
    wbmp: 'image/vnd.wap.wbmp',
    webp: 'image/webp',
    ico: 'image/x-icon',
    jng: 'image/x-jng',
    bmp: 'image/x-ms-bmp',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    mpg: 'video/mpeg',
    mpeg: 'video/mpeg',
    wmv: 'video/x-ms-wmv',
    avi: 'video/x-msvideo'
};

  
http.createServer(function (request, response) {
  
    let url = decodeURIComponent(request.url.substring(1)) || 'index.html';

    response.writeHead(200, {
        'Content-Type': mime[path.extname(url).substring(1)] || 'application/octet-stream'
    });

    if (fs.existsSync(url = path.join(base, url)))
    {
        response.end(fs.readFileSync(url));
    }
    else
    {
        response.end();
    }

}).listen(8080);


console.log('http server listen at port 8080!');
