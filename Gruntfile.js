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
            options: {
            },
            dev: {
                options: {
                    script: 'server.js'
                }
            },
            prod: {
                options: {
                    script: 'app.js',
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
        cssmin: {
            request: {
                expand: true,
                cwd: 'public/stylesheets',
                src: ['*.css', '!jasmine.css'],
                dest: 'build/public/stylesheets'
            }
        },
        htmlmin: {
            prod: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    removeAttributeQuotes: true
                },
                files: {
                    'build/views/dynamic.ejs': 'views/dynamic.ejs',
                }
            }
        },
        open: {
            index:   { path: 'http://127.0.0.1:3000' },
        },
        connect: {
            test: {
                port: 8000,
                options: {
                    base: [".", "public"]
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
        copy: {
            build: {
                cwd: '.',
                src: [
                    'app.js', 
                    'routes/*.js', 
                    'views/*.html', 
                    '*.json', 
                    'public/images/*'
                ],
                dest: 'build',
                expand: true
            }
        },
        clean: {
            build: {
                src: ['build']
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
    // Grunt task for minimizing css 
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    // Grunt task to open things like a web browser
    grunt.loadNpmTasks('grunt-open');
    // Grunt task for the css preprocessing
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-karma');

    // register all of the grunt tasks
    grunt.registerTask('default', ['express:prod']);
    grunt.registerTask('server', ['express:dev',
        'less:dist', 'watch:reload', 'watch:express']);
    grunt.registerTask('test', ['shell:mongo', 'watch:jasmine']);
};
