module.exports = {
  themeAssets: {
    files: [{
      expand: true,
      cwd: 'scss/themes',
      src: '**/assets/**',
      dest: 'css/themes'
    }]
  }
}
