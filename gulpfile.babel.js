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

let resolveToCommon = (glob = '') => {
  return path.join(root, 'app/components/common', glob); // app/components/{glob}
};

let resolveToPages = (glob = '') => {
  return path.join(root, 'app/components/pages', glob); // app/components/{glob}
};

let resolveToDirectives = (glob = '') => {
  return path.join(root, 'app/directives', glob); // app/components/{glob}
};

// map of all paths
let paths = {
  js: resolveToApp('**/*!(.spec.js).js'), // exclude spec files
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
    'common': path.join(__dirname, 'generator', 'common/**/*.**'),
    'page': path.join(__dirname, 'generator', 'page/**/*.**'),
    'directive': path.join(__dirname, 'generator', 'directive/**/*.**')
  },
  dest: path.join(__dirname, 'dist')
};

gulp.task('webpack', ['build']);

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

    exec('cd dist;zip -9 -r --exclude=*.htaccess --exclude=*.svn* --exclude=*.DS_Store* --exclude=*.py* --exclude=*.pyc* admin-app_build.zip . -x *.png *.gif *.jpg; zip -0 -r admin-app_build.zip . -i *.png *.gif *.jpg;mv admin-app_build.zip ' + target + '_$(date +%Y-%m-%d_%H%M).interactive');

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

gulp.task('component', ['common']);

gulp.task('common', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToCommon(), parentPath, name);

  return gulp.src(paths.blankTemplates['common'])
    .pipe(template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('page', () => {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };
  const dash = (val) => {
    return val.replace(/\W+/g, '-')
              .replace(/([a-z\d])([A-Z])/g, '$1-$2')
              .toLowerCase();
  };
  const name = yargs.argv.name;
  const parentPath = yargs.argv.parent || '';
  const destPath = path.join(resolveToPages(), parentPath, name);

  return gulp.src(paths.blankTemplates['page'])
    .pipe(template({
      name: name,
      upCaseName: cap(name),
      dashCaseName: dash(name)
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
  const destPath = path.join(resolveToDirectives(), parentPath, name);

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
