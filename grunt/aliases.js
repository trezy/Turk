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
    'clean:app',
    'copy:dist',
    'uglify:dist',
    'cssmin:dist',
    'shell:installProductionModules',

    'clean:packages',
    'shell:packageWin',
    'shell:packageOSX',

    'clean:builds',
    'shell:buildWin',
    'shell:buildOSX',
    'clean:app',
    'clean:packages'
  ]
}
