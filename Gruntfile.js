(function() {
  module.exports = function(grunt) {
    grunt.initConfig({
      stylus: {
        compile: {
          options: {
            compress: true
          },
          files: {
            './public/stylesheets/admin_styles.css': './public/stylesheets/admin_styles.styl',
            './public/stylesheets/admin_index_styles.css': './public/stylesheets/admin_index_styles.styl',
            './public/stylesheets/style.css': './public/stylesheets/style.styl',
            './public/stylesheets/apiStyles.css': './public/stylesheets/apiStyles.styl'
          }
        }
      },
      coffee: {
        compile: {
          files: [
            {
              expand: true,
              cwd: "./",
              src: ["**/**/*.coffee"],
              dest: "./",
              ext: ".js"
            }
          ]
        }
      },
      watch: {
        stylus: {
          files: './public/stylesheets',
          tasks: ['stylus']
        },
        scripts: {
          files: './**/**/*.coffee',
          tasks: ['coffee']
        }
      }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    return grunt.registerTask("default", ['watch']);
  };

}).call(this);
