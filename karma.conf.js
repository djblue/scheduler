module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [

        // libraries
        'public/bower_components/jquery/jquery.min.js',
        'public/bower_components/underscore/underscore-min.js',
        'public/bower_components/angular/angular.min.js',
        'public/bower_components/angular-route/angular-route.min.js',
        'public/bower_components/angular-mocks/angular-mocks.js',

        // our app
        'public/javascripts/*.js',

        // tests
        'public/javascripts/specs/*.js',

        // templates
        'public/partials/*.html'

    ],

    preprocessors: {
        'public/partials/*.html': 'ng-html2js'
    },

    ngHtml2JsPreprocessor: {
        stripPrefix: 'public'
    },

    autoWatch: true,
    browsers: ['PhantomJS'],
    reporters: ['dots']

  });
};
