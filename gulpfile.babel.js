'use strict';

import gulp     from 'gulp';
import webpack  from 'webpack';
import path     from 'path';
import sync     from 'run-sequence';
import rename   from 'gulp-rename';
import template from 'gulp-template';
import fs       from 'fs';
import yargs    from 'yargs';
import lodash   from 'lodash';
import gutil    from 'gulp-util';
import serve    from 'browser-sync';
import mfly     from 'mfly-interactive';
import shell    from 'gulp-shell';
import del      from 'del';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import colorsSupported      from 'supports-color';
import historyApiFallback   from 'connect-history-api-fallback';

// The relative url you would like the serve command to automatically open to.
// Should not contain the FQDN portion and should start with a '/'.
let serveOpen = '';

// The fully formed URL of an interactive on viewer.mediafly.com that should be
// used as a proxy into the cloud based filesystem.
let mflyProxy = '';

let root = 'client';

// helper method for resolving paths
let resolveToApp = (glob = '') => {
  return path.join(root, 'app', glob); // app/{glob}
};

let resolveToComponents = (glob = '') => {
  return path.join(root, 'app/components', glob); // app/components/{glob}
};

// map of all paths
let paths = {
  js: resolveToComponents('**/*!(.spec.js).js'), // exclude spec files
  scss: resolveToApp('**/*.scss'), // stylesheets
  html: [
    resolveToApp('**/*.html'),
    path.join(root, 'index.html')
  ],
  entry: [
    'babel-polyfill',
    path.join(__dirname, root, 'app/app.js')
  ],
  output: root,
  blankTemplates: {
    'component': path.join(__dirname, 'generator', 'component/**/*.**'),
    'directive': path.join(__dirname, 'generator', 'directive/**/*.**')
  },
  dest: path.join(__dirname, 'dist')
};

// use webpack.config.js to build modules
gulp.task('build', ['clean'], (cb) => {
  const target = yargs.argv.target || 'dev';
  const config = require('./webpack.' + target + '.config');
  config.entry.app = paths.entry;

  webpack(config, (err, stats) => {
    if(err)  {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: colorsSupported,
      chunks: false,
      errorDetails: true
    }));

    exec('cd dist;zip -9 -r --exclude=*.htaccess --exclude=*.svn* --exclude=*.DS_Store* --exclude=*.py* --exclude=*.pyc* admin-app_build.zip . -x *.png *.gif *.jpg; zip -0 -r admin-app_build.zip . -i *.png *.gif *.jpg;mv admin-app_build.zip ' + target + '_$(date +%Y-%m-%d_%H%M).zip');

    cb();
  });
});

gulp.task('serve', () => {
  let mflyMiddleware = (req, res, next) => { return next(); };
  let config = require('./webpack.dev.config');

  if (mflyProxy !== '') {
    mflyMiddleware = mfly({
      url: mflyProxy
    });

    config = require('./webpack.proxy.config');
  }

  config.entry.app = [
    // this modules required to make HRM working
    // it responsible for all this webpack magic
    'webpack-hot-middleware/client?reload=true',
    // application entry point
  ].concat(paths.entry);

  var compiler = webpack(config);

  serve({
    port: process.env.PORT || 3000,
    open: 'local',
    startPath: serveOpen,
    server: {baseDir: root},
    middleware: [
      webpackHotMiddleware(compiler),
      mflyMiddleware,
      historyApiFallback(),
      webpackDevMiddleware(compiler, {
        stats: {
          colors: colorsSupported,
          chunks: false,
          modules: false
        },
        publicPath: config.output.publicPath
      })
    ]
  });
});

gulp.task('watch', ['serve']);

gulp.task('component', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(paths.blankTemplates['component'])
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('directive', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(paths.blankTemplates['directive'])
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('clean', (cb) => {
  del([paths.dest]).then(function (paths) {
    gutil.log("[clean]", paths);
    cb();
  })
});

gulp.task('default', ['watch']);
