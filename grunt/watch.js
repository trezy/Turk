module.exports = {
  options: {
    spawn: true,
    interrupt: true
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
