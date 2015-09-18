module.exports = {
  default: [
    'build',
    'watch'
  ],

  build: [
    'buildCSS',
    'buildJS'
  ],

  buildJS: [
    'webpack'
  ],

  buildCSS: [
    'clean:css',
    'buildAppCSS',
    'buildThemesCSS'
  ],

  buildAppCSS: [
    'sass:app',
    'autoprefixer:app'
  ],

  buildThemesCSS: [
    'sass:themes',
    'autoprefixer:themes',
    'copy:themeAssets'
  ]
}
