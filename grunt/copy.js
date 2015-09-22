module.exports = {
  themeAssets: {
    files: [{
      expand: true,
      cwd: 'scss/themes',
      src: '**/assets/**',
      dest: 'css/themes'
    }]
  },

  dist: {
    files: [
      {
        expand: true,
        flatten: true,
        cwd: '',
        src: [
          'bundle.js',
          'index.html',
          'main.js',
          'package.json'
        ],
        dest: 'app'
      },

      {
        expand: true,
        flatten: false,
        cwd: '',
        src: [
          'css/**/*'
        ],
        dest: 'app'
      }
    ]
  }
}
