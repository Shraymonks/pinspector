'use strict';

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var webpackDistConfig = require('./webpack.dist.config.js'),
    webpackDevConfig = require('./webpack.config.js');

module.exports = function (grunt) {
  // Let *load-grunt-tasks* require everything
  require('load-grunt-tasks')(grunt);

  // Read configuration from package.json
  var pkgConfig = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkgConfig,

    webpack: {
      options: webpackDistConfig,
      dist: {
        cache: false
      }
    },

    watch: {
      files: ['panelSrc/**/*.js', 'panelSrc/**/*.css'],
      tasks: ['build']
    },

    'webpack-dev-server': {
      options: {
        hot: true,
        port: 8000,
        webpack: webpackDevConfig,
        publicPath: '/panelDist/assets/',
        contentBase: './<%= pkg.src %>/'
      },

      start: {
        keepAlive: true
      }
    },

    connect: {
      options: {
        port: 8000
      },

      dist: {
        options: {
          keepalive: true,
          middleware: function (connect) {
            return [
              mountFolder(connect, pkgConfig.dist)
            ];
          }
        }
      }
    },

    open: {
      options: {
        delay: 500
      },
      dev: {
        path: 'http://localhost:<%= connect.options.port %>/webpack-dev-server/'
      },
      dist: {
        path: 'http://localhost:<%= connect.options.port %>/'
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    copy: {
      dist: {
        files: [
          // includes files within path
          {
            flatten: true,
            expand: true,
            src: [
                '<%= pkg.src %>/*',
                'node_modules/react-codemirror/node_modules/codemirror/lib/codemirror.css',
                'node_modules/react-codemirror/node_modules/codemirror/lib/codemirror.js',
                'node_modules/react-codemirror/node_modules/codemirror/addon/edit/*.js',
                'node_modules/react-codemirror/node_modules/codemirror/mode/javascript/javascript.js'
            ],
            dest: '<%= pkg.dist %>/',
            filter: 'isFile'
          },
          {
              flatten: true,
              expand: true,
              src: ['<%= pkg.src %>/styles/font-awesome.css'],
              dest: '<%= pkg.dist %>/styles/'
          },
          {
              flatten: true,
              expand: true,
              src: ['<%= pkg.src %>/styles/fonts/*'],
              dest: '<%= pkg.dist %>/fonts/'
          },
          {
            flatten: true,
            expand: true,
            src: ['<%= pkg.src %>/images/*'],
            dest: '<%= pkg.dist %>/images/'
          }
        ]
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= pkg.dist %>'
          ]
        }]
      }
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open:dist', 'connect:dist']);
    }

    grunt.task.run([
      'open:dev',
      'webpack-dev-server'
    ]);
  });

  grunt.registerTask('test', ['karma']);

  grunt.registerTask('build', ['clean', 'copy', 'webpack']);

  grunt.registerTask('default', []);

  grunt.loadNpmTasks('grunt-contrib-watch');
};
