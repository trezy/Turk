module.exports = {
  options: {
    spawn: true,
    interrupt: true
  },

  js: {
    files: [
      'js/**/*.js',
      'templates/**/*.hbs',
      'config.json'
    ],
    tasks: [
      'buildJS'
    ]
  },

  sassApp: {
    files: [
      'scss/app/**/*.scss'
    ],
    tasks: [
      'buildAppCSS'
    ]
  },

  sassThemes: {
    files: [
      'scss/themes/**/*.scss'
    ],
    tasks: [
      'buildThemesCSS'
    ]
  }
}
