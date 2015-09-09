module.exports = {
  app: {
    options: {
      map: {
        prev: ''
      }
    },
    src: 'css/app.css',
    dest: 'css/app.css'
  },

  themes: {
    options: {
      map: true
    },
    files: [{
      expand: true,
      cwd: 'css/themes',
      src: '**/*.css',
      dest: 'css/themes'
    }]
  }
}
