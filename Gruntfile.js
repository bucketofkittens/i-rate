// Обязательная обёртка
module.exports = function(grunt) {

    // Задачи
    grunt.initConfig({
        // Склеиваем
        concat: {
            main: {
                src: [
                	'js/jquery-2.0.3.min.js',
                    'js/jquery.Jcrop.min.js',
                    'js/jquery.jcrop-canvas.js',
                	'js/angular.min.js',
                	'js/angular-route.min.js',
                    'js/angular-animate.min.js',
                    'js/angular-sanitize.min.js',
                	'js/angular-resource.min.js',
                	'js/angular-cookies.min.js',
                	'js/angular-touch.min.js',
                    'js/angular-recaptcha.min.js',
                    'js/angular-google-plus.js',
                    'js/angular-google-analytics.js',
                    'js/ng-quick-date.min.js',
                    'js/select2.min.js',
                    'js/angular-select2.js',
                    'js/facebook.js',
                    'js/jquery.isotope.min.js',
                    'js/jquery.isotope.perfectmasonry.js',
                    'js/date.js',
                    'js/keypress.js',
                    'js/moment+langs.min.js',
                	'js/localize.js',
                    'js/rzslider.min.js',
                    'js/lscache.js',
                    'js/elastic.js',
                    'js/libs/*.js',
                    'js/libs/controllers/*.js'
                ],
                dest: 'build/scripts.js'
            },
            css: {
                src: [
                    "css/reset.css",
                    "css/rzslider.min.css",
                    "css/master.css"
                ],
                dest: "build/style.css"
            }
        },
        watch: {
		    concat: {
		        files: '<%= concat.main.src %>',
		        tasks: ['concat', 'cssmin']
		    }
		},
        cssmin: {
          minify: {
            expand: true,
            cwd: 'build/',
            src: ['*.css', '!*.min.css'],
            dest: 'build/',
            ext: '.min.css'
          }
        },
        prangler: {
            default: {
              options: {
                ngApp: 'pgrModule'
              },
              files: {
                'js/libs/templates.js': ['views/*.html', 'partials/*.html', 'views/profile/*.html'],
              }
            }
        },
       imageEmbed: {
            dist: {
              src: [ "build/style.css" ],
              dest: "build/style.base64.css",
              options: {
                deleteAfterEncoding : false,
                maxImageSize: 999999
              }
            }
        },
        uglify: {
            options: {
              mangle: false
            },
            my_target: {
              files: {
                'build/scripts.min.js': ['build/scripts.js']
              }
            }
        }
    });

    // Загрузка плагинов, установленных с помощью npm install
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Задача по умолчанию
    grunt.registerTask('default', ['prangler', 'concat', 'imageEmbed', 'uglify']);
};