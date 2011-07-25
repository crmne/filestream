var express = require('express'),
    form    = require('connect-form');

var app     = express.createServer();
var port    = process.env.PORT || 3000;
var uploads = {};

app.configure(function () {
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(form({ keepExtensions: true }));
  app.set('view engine', 'jade');
});

app.configure('development', function () {
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});


function createUploadIfDoesNotExists (req, res, next) {
  uploads[req.params.id] = uploads[req.params.id] || {};
  next();
}

function loadUpload (req, res, next) {
  var upload = uploads[req.params.id];
  if (upload) {
    req.upload = upload;
    next();
  } else {
    res.send('Sorry! No upload "' + req.params.id + '" found.', 404);
  }
}

app.get('/', function(req, res) {
  res.render('index', {uploads: uploads});
});

app.post('/upload/:id', createUploadIfDoesNotExists, loadUpload, function(req, res, next) {
  req.form.on('progress', function(bytesReceived, bytesExpected) {
    var percent = (bytesReceived / bytesExpected * 100) | 0;
    req.upload.percent = percent;
  });

  req.form.complete(function(err, fields, files) {
    if (err) {
      next(err);
    } else {
      req.upload.file = files.file;
      req.upload.link = '/upload/' + req.params.id;
      console.log('Uploaded %s', JSON.stringify(req.upload));
      res.redirect('back');
    }
  });
});

app.get('/upload/:id', loadUpload, function(req, res) {
  res.attachment(req.upload.file.name);
  res.sendfile(req.upload.file.path);
});

app.get('/upload/:id/status', loadUpload, function(req, res) {
  res.send(JSON.stringify(req.upload));
});

app.get('/uploads.json', function(req, res) {
  res.send(JSON.stringify(uploads));
});

app.post('/upload/:id/comment', loadUpload, function(req, res) {
  req.upload.comment = req.body.comment;
});

app.listen(port);
console.log('FileStream app listening on http://localhost:'+port+'/');
