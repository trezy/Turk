module.exports = {
  default: [
    'build',
    'watch'
  ],

  build: [
    'buildCSS'
  ],

  buildCSS: [
    'clean',
    'sass'
  ]
}
