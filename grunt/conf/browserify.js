
module.exports = {
  js: {
    src: '<%= src.main %>',
    dest: '<%= distdir %>/verdict.js'
  },
  options: {
    browserifyOptions: {
      standalone: 'verdict'
    }
  }
};
