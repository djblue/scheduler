var app         = require('./app').app
  , server      = require('http').createServer(app);


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

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
