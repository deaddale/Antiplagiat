// Стандартный экспорт модуля в nodejs
module.exports = function(grunt) {

    // Инициализация конфига GruntJS (конфигурация проекта)
    grunt.initConfig({

        // package.json
        pkg: grunt.file.readJSON('package.json'),

        // Переменные каталогов проекта
        project: {
            app:    ['public'],
            assets: ['<%= project.app %>/assets'],
            js:     ['<%= project.assets %>/js']
        },

        // Настройки сервера
        express: {
            dev: {
                options: {
                    script: 'server.js'
                }
            }
        },

        // Склеивание JS файлов
        concat: {
            dist: {
                src: [
                    '<%= project.libs %>/{,*/}*.js',
                    '<%= project.js %>/*.js'
                ],
                dest: '<%= project.js %>/build/production.js'
            }
        },

        // Сжатие общего JS файла
        uglify: {
            build: {
                src: '<%= project.js %>/build/production.js',      // production
                dest: '<%= project.js %>/build/production.min.js'  // production min
            }
        },

        // Слежение за изменениями        
        watch: {
            scripts: {
                files: [
                    '<%= project.js %>/*.js',
                    '<%= project.libs %>/*.js'
                ],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                }
            }
        }

    });

    // Загрузка модулей, которые предварительно установлены
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Эти задания будут выполнятся сразу после команды grunt
    grunt.registerTask('default', ['express', 'concat', 'uglify', 'watch']);

};