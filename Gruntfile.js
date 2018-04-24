/*-----------------------------------------------------
 * livereload Default Setting
 *-----------------------------------------------------*/

/* global require, module */
//'use strict';
var path = require('path');

/*-----------------------------------------------------
 * Module Setting
 *-----------------------------------------------------*/
module.exports = function (grunt) {

  // These plugins provide necessary tasks.
  /* [Build plugin & task ] ------------------------------------*/
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-copy');
  //grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-module-dependence');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  //grunt.loadNpmTasks('grunt-contrib-less');
  //grunt.loadNpmTasks('grunt-postcss');
  //grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-css');

  var banner = '/*!* ====================================================\n' +
    ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("isoDateTime") %>\n' +
    //'<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    //' * GitHub: <%= pkg.repository.url %> \n' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
    //' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
    ' * ====================================================\n' +
    ' */\n\n' +
    '/*!* ====================================================\n' +
    ' * kityminder - v1.4.0 - 2015-09-10\n' +
    ' * https://github.com/fex-team/kityminder-core\n' +
    ' * GitHub: https://github.com/fex-team/kityminder-core.git\n' +
    ' * Copyright (c) 2015 Baidu FEX; Licensed MIT\n' +
    ' * ====================================================\n' +
    ' */\n\n';


  var libJS = [
    // 'lib/jquery-2.1.1.js',
    'lib/jhtmls.min.js',
    'lib/store.js',
    'lib/fui/dist/fui.all.js',
    'lib/kity/dist/kity.js',
    'lib/react/dist/build/react-with-addons.js',
    'lib/react/dist/build/react-dom.js',
  ];
  var libMinJS = [
    // 'lib/jquery-2.1.1.js',
    'lib/jhtmls.min.js',
    'lib/store.min.js',
    'lib/fui/dist/fui.all.min.js',
    'lib/kity/dist/kity.js',
    'lib/react/dist/build/react-with-addons.min.js',
    'lib/react/dist/build/react-dom.min.js',
    //  'lib/xmleditor/xmleditor.min.js',
  ];
  var libCSS = [
    'theme/default/css/default.all.css',
    'lib/jsoneditor/jsonEditor.css'
  ];

  var expose = '\nuse(\'expose\');\n';
  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    clean: ['release'],

    dependence: {
      options: {
        base: 'src',
        entrance: 'expose'
      },
      merge: {
        files: [{
          src: 'src/**/*.js',
          dest: 'temp/witdesigner.core.js'
        }, {
          src: 'ui/**/*.js',
          dest: 'temp/ui.core.js'
        }]
      }
    },

    concat: {
      closure: {
        options: {
          banner: '(function () {\n',
          footer: expose + '})();'
        },

        files: {
          'temp/witdesigner.core.js': ['temp/witdesigner.core.js'],
          'temp/ui.core.js': ['temp/ui.core.js'],
          // 'release/core.js': ['temp/kityminder.core.js',
          //   'temp/ui.core.js'
          // ]
        }
      },
      sign: {
        options: {
          banner: banner,
          footer: ''
        },

        files: {
          'release/witdesigner.js': [
            'lib/jsoneditor/jsonEditor.js',
            'temp/witdesigner.core.js',
            'temp/ui.core.js',
          ]
        }
      },
      css: {
        options: {
          banner: banner,
          footer: ''
        },
        src: libCSS,
        dest: 'release/witdesigner.css'
      },
      lib: {
        src: libJS,
        dest: 'release/lib.js'
      },
      libmin: {
        src: libMinJS,
        dest: 'release/lib.js'
      }
    },

    uglify: {
      normal: {
        options: {
          banner: banner
        },
        files: {
          //'release/kityminder.core.min.js': 'release/kityminder.core.js',
          //'release/ui.core.min.js': 'release/ui.core.js',
          'release/witdesigner.min.js': 'release/witdesigner.js'
        }
      },
      lib: {
        files: {
          'release/lib.min.js': 'release/lib.js'
        }
      }
    },

    cssmin: {
      css: {
        src: 'release/witdesigner.css',
        dest: 'release/witdesigner.min.css'
      }
    }
  });

  grunt.registerTask('default', ['dependence', 'concat:closure', 'concat:sign' ]);

  grunt.registerTask('build', ['dependence', 'concat:closure', 'concat:sign', 'uglify:normal']);

  grunt.registerTask('clean', ['clean']);
  grunt.registerTask('css', ['concat:css', 'cssmin']);

  //未压缩的lib.js
  grunt.registerTask('lib', ['concat:lib']);

  //压缩的lib.min.js
  grunt.registerTask('releaselib', ['concat:libmin', 'uglify:lib']);

  //witdesigner.(min.)css witdesigner.(min.)js
  grunt.registerTask('release', ['build', 'css']);
};
