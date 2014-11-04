module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: [
        'app.js',
        'Gruntfile.js',
        'api/*.js'
      ],
      options: {
        laxcomma: true,
        ignores: [
          'public/javascripts/components/**/*.js'
        ]
      }
    },
    express: {
      dev: {
        options: {
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          node_env: 'production',
          background: false,
          debug: false
        }
      }
    },
    watch: {
      express: {
        files: ['app.js', 'api/*.js'],
        tasks: ['express:dev'],
        options: {
          nospawn: true
        }
      },
      jasmine: {
        files: ['app.js', 'api/**/*.js'],
        tasks: ['jshint', 'jasmine_node'],
        options: {
          spawn: true // don't crash grunt
        }
      },
      reload: {
        files: [
          'public/styles/*.scss',
          'public/javascripts/**/*.js',
          'public/**/*.html',
          'views/*'
        ],   
        tasks: ['sass:dist'],
        options: {
           livereload: true
        }
      }
    },
    jasmine_node: {
      projectRoot: "./api/specs",
      specNameMatcher: "*",
      forceExit: true,
      verbose: false,
      config: {
        env: 'production'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    less: {
      dist: {
        files: {
          'public/styles/main.css': 'public/styles/main.less'
        }
      }
    }
  });

  // Load the plugins 

  // validate files with JSHint.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Run tasks whenever watched files change
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Grunt task for running an Express Server
  grunt.loadNpmTasks('grunt-express-server');

  // Grunt task for the css preprocessing
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-karma');

  // register all of the grunt tasks
  grunt.registerTask('server', ['express:dev', 'less:dist', 'watch:express']);
};
