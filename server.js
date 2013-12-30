var fs     = require('fs')
  , app    = require('./app').app
  , https  = require('https');


var options = {
    key:  fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem')
};

// If all of the routes fail!!1
app.use(function(req, res, next){
    
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});

https.createServer(options, app).listen(443, function () {
    console.log('Express server listening on port ' + app.get('port'));
});
