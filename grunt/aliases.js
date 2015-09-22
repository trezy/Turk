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
  ],

  dist: [
    'clean:dist',
    'copy:dist',
    'uglify:dist',
    'cssmin:dist',
    'shell:installProductionModules',

    'clean:builds',
    'shell:packageWin',
    'shell:packageOSX',
    'shell:buildWin',
    'shell:buildOSX'
  ]
}
