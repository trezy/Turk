module.exports = {
  app: {
    target: 'node',

    devtool: 'source-map',

    entry: './js/index.js',

    output: {
      filename: 'bundle.js',
      sourceMapFilename: 'bundle.js.map'
    },

    module: {
      loaders: [
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader'
        }
      ]
    },

    resolve: {
      alias: {
        collections: __dirname + '/../js/collections',
        models: __dirname + '/../js/models',
        shims: __dirname + '/../js/shims',
        templates: __dirname + '/../templates',
        views: __dirname + '/../js/views'
      }
    },

    externals: {
      irc: 'commonjs irc'
    },

    stats: {
      colors: true,
      reasons: true
    }
  }
}
