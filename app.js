var util        = require('util')
  , express     = require('express')
  , app         = express()
  , path        = require('path')
  , ejs         = require('ejs')
  , mongoose    = require('mongoose')

    // load api
  , passport    = require('passport')
  , auth        = require('./api/auth')
  , users       = require('./api/users')
  , courses     = require('./api/courses')
  , staff       = require('./api/staff');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev')); 
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '97e0089deda4f396f7e3a85c8aa62e37'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    // connect to database
}

if (!!process.env.MONGOLAB_URI) {
    mongoose.connect(process.env.MONGOLAB_URI);
} else {
    mongoose.connect('mongodb://localhost/test');
}

auth.setup(app);
users.setup(app);
staff.setup(app);
courses.setup(app);

app.get('/', function (req, res) {
    res.render('hours');
});
app.post('/', function (req,res) {
    res.json(req.body);
});

//mongooseApi.serveModels(app);
var db = mongoose.connection; 

db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function() {
    console.log('Database connection successful.');
});

exports.app = app;
