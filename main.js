var http = require('http');
var url = require('url');
var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer((req, res) => {
  var _url = req.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === '/') {
    if (queryData.id === undefined) {
      topic.index(req,res);
    } else {
      topic.page(req,res,queryData);
    }
  } else if (pathname === '/create') {
    topic.create(req,res);
  } else if (pathname === '/create_process') {
    topic.create_process(req,res);
  } else if (pathname === '/update') {
    topic.update(req,res,queryData);
  } else if (pathname === '/update_process') {
    topic.update_process(req,res);
  } else if (pathname === '/delete_process') {
    topic.delete_process(req,res);
  } else if (pathname === '/author') {
    author.index(req,res);
  } else if (pathname === '/author/create_process') {
    author.create_process(req,res);
  } else if (pathname === '/author/update') {
    author.update(req,res,queryData);
  } else if (pathname === '/author/update_process') {
    author.update_process(req,res);
  } else if (pathname === '/author/delete_process') {
    author.delete_process(req,res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});
app.listen(3000);
