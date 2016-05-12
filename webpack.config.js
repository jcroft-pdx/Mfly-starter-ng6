var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'sourcemap',
  entry: {},
  eslint: {
    configFile: './.eslintrc'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: [/app\/lib/, /bower_components/, /node_modules/], loader: 'ng-annotate!babel' },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=100000' },
      { test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
      { test: /\.html$/, loader: 'raw' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!postcss-loader!resolve-url!sass-loader?sourceMap!sass?sourceMap' },
      { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader!resolve-url' },
      // Special exports code for non-amd capable libraries.
      { test: /[\/]mflyCommands\.js$/, loader: "exports?mflyCommands" }
    ]
  },
  plugins: [
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      inject: 'body',
      hash: true
    }),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
      }
    }),

    // Auto parses bower components to pack their main js files.
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    ),

    // This makes jQuery available all the time so legacy modules don't choke.
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      mflyCommands: 'mfly-commands',
      Hammer: 'hammerjs'
    })
  ],
  postcss: function () {
    // Configuration for autoprefixer.
    return [ autoprefixer({ browsers: ['last 2 versions'] }) ];
  },
  resolve: {
    // This essentially shims bower components so they can be loaded as if they
    // are AMD capable.
    extensions: ['', '.js'],
    modulesDirectories: ["node_modules", "bower_components"]
  }
};
