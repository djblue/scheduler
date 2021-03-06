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
  , locations   = require('./api/locations')
  , courses     = require('./api/courses')
  , subjects    = require('./api/subjects')
  , staff       = require('./api/staff')
  , log         = require('./api/log');

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

mongoose.connect('mongodb://localhost/test');

auth.setup(app);
users.setup(app);
staff.setup(app);
locations.setup(app);
subjects.setup(app);
courses.setup(app);
log.setup(app);

app.get('/', auth.isAuthenticated, function (req, res) {
    res.render('index', {
        title: 'Login'
    }); 
});

//mongooseApi.serveModels(app);
var db = mongoose.connection; 

db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', function() {
    console.log('Database connection successful.');
});

exports.app = app;
