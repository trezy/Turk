module.exports = {
  default: [
    'build',
    'watch'
  ],

  build: [
    'buildCSS'
  ],

  buildCSS: [
    'clean:css',
    'buildAppCSS',
    'buildThemesCSS'
  ],

  buildAppCSS: [
    'sass:app'
  ],

  buildThemesCSS: [
    'sass:themes',
    'copy:themeAssets'
  ]
}
