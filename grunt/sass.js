module.exports = {
  app: {
    options: {
      style: 'expanded'
    },

    files: {
      'css/app.css': 'scss/main/app.scss'
    }
  },
  themes: {
    files: [{
      expand: true,
      flatten: true,
      cwd: 'scss/themes',
      src: '**/*.scss',
      dest: 'css/themes',
      ext: '.css'
    }]
  }
}
