module.exports = {
  app: {
    options: {
      style: 'expanded'
    },

    files: {
      'css/app.css': 'scss/app/app.scss'
    }
  },

  themes: {
    files: [{
      expand: true,
      cwd: 'scss/themes',
      src: '**/*.scss',
      dest: 'css/themes',
      ext: '.css'
    }]
  }
}
