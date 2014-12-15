'use strict';

module.exports = function(grunt) {

  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-karma');

  var allJavaScriptFilePaths = [
    'app/js/**/*.js',
    'app/app.js',
    'models/*.js',
    'routes/*.js',
    'lib/*.js',
    'server.js'
  ];

  grunt.initConfig({

    clean: {
      dev: {
        src: ['build/']
      }
    },

    copy: {
      dev: {
        expand: true,
        cwd: 'app/',
        src: [
          '*.html',
          'assets/*.*',
          'css/*.css',
          'views/*.html',
          'templates/*.html'
        ],
        dest: 'build/',
        filter: 'isFile'
      }
    },

    jshint: {
      all: allJavaScriptFilePaths,
      options: {
        jshintrc: true
      }
    },

    browserify: {
      dev: {
        options: {
          transform: ['debowerify'],
          debug: true
        },
        src: [
          'app/js/**/*.js',
          'app/app.js'
        ],
        dest: 'build/scripts.js'
      },
      angulartest: {
        options: {
          transform: ['debowerify'],
          debug: true
        },
        src: ['test/angular/**/*test.js'],
        dest: 'test/angular-testbundle.js'
      }
    },

    sass: {
      build: {
        files: {
          'app/css/styles.css': 'app/css/scss/styles.scss'
        }
      }
    },

    simplemocha: {
      all: {
        src: ['test/mocha/**/*.js']
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      continuous: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: [ 'PhantomJS' ]
      },
    },

    express: {
      dev: {
        options: {
          script: 'server.js',
          background: true
        }
      }
    },

    watch: {
      express: {
        files: [
          'app/js/**/*.js',
          'app/index.html',
          'app/css/scss/*.scss',
          'app/templates/*.html',
          'app/views/*.html'
        ],
        tasks: [
          'jshint',
          'clean:dev',
          'browserify:dev',
          'sass:build',
          'copy:dev',
          'express:dev',
          'watch:express'
        ],
        options: {
          spawn: false
        }
      }
    }
  });

  // register tasks
  grunt.registerTask('default', [
      'jshint',
      'clean:dev',
      'browserify:dev',
      'sass:build',
      'copy:dev',
      'express:dev',
      'watch:express'
    ]);

  grunt.registerTask('build', [
      'jshint',
      'clean:dev',
      'browserify:dev',
      'sass:build',
      'copy:dev'
    ]);

  grunt.registerTask('test', [
      'clean:dev',
      'browserify:dev',
      'sass:build',
      'copy:dev',
      'simplemocha',
      
    ]);

  grunt.registerTask('angular-test', [
    'browserify:angulartest',
    'karma:unit'
    ]);

  grunt.registerTask('serve',[
      'express:dev',
      'watch:express'
    ]);

};