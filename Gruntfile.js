
module.exports = function(grunt) {
  var cfg = require('require-grunt-configs')(grunt, 'grunt/conf');
  grunt.initConfig(cfg);

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', [
    'clean',
    'jshint',
    'browserify',
    'uglify'
  ]);
};
